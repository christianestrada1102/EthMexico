// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title BridgeFastWithdrawImproved
 * @notice Sistema de retiros rápidos MEJORADO con seguridad adicional
 * @dev Incluye Ownable, ReentrancyGuard, y validaciones mejoradas
 */
contract BridgeFastWithdrawImproved is Ownable, ReentrancyGuard, Pausable {
    
    // ============================================
    // ESTRUCTURAS DE DATOS
    // ============================================
    
    struct WithdrawalRequest {
        address user;
        uint256 amount;
        uint256 timestamp;
        uint256 challengePeriodEnd;
        address liquidityProvider;
        bool isAdvanced;
        bool isFinalized;
        uint256 fee;
        uint256 lockedBondAmount; // Nuevo: bond lockeado por esta solicitud
    }
    
    // ============================================
    // VARIABLES DE ESTADO
    // ============================================
    
    mapping(uint256 => WithdrawalRequest) public withdrawals;
    uint256 public withdrawalCounter;
    uint256 public feePercentage = 100; // 1% por defecto
    uint256 public constant CHALLENGE_PERIOD = 7 days;
    uint256 public testChallengePeriod = 7 days;
    uint256 public minimumBond = 0.1 ether;
    
    mapping(address => uint256) public lpBonds;
    mapping(address => uint256) public lockedBonds; // Nuevo: bonds lockeados
    
    // Nuevo: Prevenir retiros duplicados simultáneos
    mapping(address => uint256) public userActiveRequest;
    uint256 public maxRequestsPerUser = 10;
    
    // ============================================
    // EVENTOS
    // ============================================
    
    event WithdrawalRequested(
        uint256 indexed requestId,
        address indexed user,
        uint256 amount,
        uint256 challengePeriodEnd
    );
    
    event LiquidityProvided(
        uint256 indexed requestId,
        address indexed liquidityProvider,
        uint256 amount,
        uint256 fee
    );
    
    event WithdrawalFinalized(
        uint256 indexed requestId,
        address indexed liquidityProvider,
        uint256 amount
    );
    
    event BondDeposited(
        address indexed liquidityProvider,
        uint256 amount
    );
    
    event BondWithdrawn(
        address indexed liquidityProvider,
        uint256 amount
    );
    
    event FeePercentageChanged(
        uint256 oldFee,
        uint256 newFee
    );
    
    // Nuevos eventos
    event BondLocked(
        address indexed liquidityProvider,
        uint256 amount
    );
    
    event BondUnlocked(
        address indexed liquidityProvider,
        uint256 amount
    );
    
    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    constructor() Ownable(msg.sender) {}
    
    // ============================================
    // FUNCIONES PRINCIPALES
    // ============================================
    
    function depositBond() external payable whenNotPaused {
        require(msg.value > 0, "Must deposit something");
        lpBonds[msg.sender] += msg.value;
        emit BondDeposited(msg.sender, msg.value);
    }
    
    function withdrawBond(uint256 amount) external nonReentrant {
        require(lpBonds[msg.sender] >= amount, "Insufficient bond");
        
        // MEJORA: No permitir retirar bonds lockeados
        require(
            lpBonds[msg.sender] - lockedBonds[msg.sender] >= amount,
            "Cannot withdraw locked bond"
        );
        
        lpBonds[msg.sender] -= amount;
        
        // MEJORA: Usar call() en lugar de transfer()
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit BondWithdrawn(msg.sender, amount);
    }
    
    function requestWithdrawal() external payable whenNotPaused {
        require(msg.value > 0, "Amount must be greater than 0");
        
        // MEJORA: Prevenir múltiples solicitudes activas simultáneas
        if (userActiveRequest[msg.sender] != 0) {
            uint256 activeId = userActiveRequest[msg.sender];
            require(
                withdrawals[activeId].isFinalized,
                "You have an active withdrawal request"
            );
        }
        
        uint256 requestId = withdrawalCounter++;
        uint256 challengeEnd = block.timestamp + testChallengePeriod;
        
        withdrawals[requestId] = WithdrawalRequest({
            user: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            challengePeriodEnd: challengeEnd,
            liquidityProvider: address(0),
            isAdvanced: false,
            isFinalized: false,
            fee: 0,
            lockedBondAmount: 0
        });
        
        userActiveRequest[msg.sender] = requestId;
        emit WithdrawalRequested(requestId, msg.sender, msg.value, challengeEnd);
    }
    
    function provideLiquidity(uint256 requestId) external payable whenNotPaused nonReentrant {
        WithdrawalRequest storage request = withdrawals[requestId];
        
        // Validaciones
        require(request.amount > 0, "Request does not exist");
        require(!request.isAdvanced, "Already advanced");
        require(!request.isFinalized, "Already finalized");
        
        // MEJORA: Verificar bond disponible (no lockeado)
        require(
            lpBonds[msg.sender] - lockedBonds[msg.sender] >= minimumBond,
            "Insufficient available bond"
        );
        
        uint256 fee = (request.amount * feePercentage) / 10000;
        uint256 amountToUser = request.amount - fee;
        
        require(msg.value >= request.amount, "Insufficient liquidity provided");
        
        // MEJORA: Checks-Effects-Interactions Pattern
        // 1. CHECKS: Ya hecho arriba
        // 2. EFFECTS: Actualizar estado PRIMERO
        
        request.isAdvanced = true;
        request.liquidityProvider = msg.sender;
        request.fee = fee;
        
        // MEJORA: Lockear bond (10% del monto adelantado)
        uint256 bondToLock = (request.amount * 10) / 100; // 10% del monto
        lockedBonds[msg.sender] += bondToLock;
        request.lockedBondAmount = bondToLock;
        emit BondLocked(msg.sender, bondToLock);
        
        // 3. INTERACTIONS: Transferir DESPUÉS
        
        // MEJORA: Usar call() en lugar de transfer()
        (bool success, ) = payable(request.user).call{
            value: amountToUser,
            gas: 50000
        }("");
        require(success, "Transfer to user failed");
        
        if (msg.value > request.amount) {
            (success, ) = payable(msg.sender).call{
                value: msg.value - request.amount,
                gas: 50000
            }("");
            require(success, "Refund to LP failed");
        }
        
        emit LiquidityProvided(requestId, msg.sender, request.amount, fee);
    }
    
    function finalizeWithdrawal(uint256 requestId) external whenNotPaused nonReentrant {
        WithdrawalRequest storage request = withdrawals[requestId];
        
        // Validaciones
        require(request.amount > 0, "Request does not exist");
        require(request.isAdvanced, "Not advanced yet");
        require(!request.isFinalized, "Already finalized");
        require(
            block.timestamp >= request.challengePeriodEnd,
            "Challenge period not ended yet"
        );
        
        // MEJORA: Verificar balance del contrato
        uint256 totalReturn = request.amount + request.fee;
        require(
            address(this).balance >= totalReturn,
            "Insufficient contract balance"
        );
        
        // Checks-Effects-Interactions
        
        request.isFinalized = true;
        
        // MEJORA: Deslockear el bond
        if (request.lockedBondAmount > 0) {
            lockedBonds[request.liquidityProvider] -= request.lockedBondAmount;
            emit BondUnlocked(request.liquidityProvider, request.lockedBondAmount);
            request.lockedBondAmount = 0;
        }
        
        // MEJORA: Usar call() en lugar de transfer()
        (bool success, ) = payable(request.liquidityProvider).call{
            value: totalReturn,
            gas: 50000
        }("");
        require(success, "Transfer to LP failed");
        
        emit WithdrawalFinalized(requestId, request.liquidityProvider, totalReturn);
    }
    
    // ============================================
    // FUNCIONES DE CONSULTA (VIEW)
    // ============================================
    
    function getWithdrawal(uint256 requestId) external view returns (WithdrawalRequest memory) {
        return withdrawals[requestId];
    }
    
    function getTimeRemaining(uint256 requestId) external view returns (uint256) {
        WithdrawalRequest memory request = withdrawals[requestId];
        if (block.timestamp >= request.challengePeriodEnd) {
            return 0;
        }
        return request.challengePeriodEnd - block.timestamp;
    }
    
    function calculateFee(uint256 amount) external view returns (uint256 fee) {
        fee = (amount * feePercentage) / 10000;
    }
    
    function canProvideLiquidity(address lp) external view returns (bool) {
        return (lpBonds[lp] - lockedBonds[lp]) >= minimumBond;
    }
    
    // Nuevo: Ver bond disponible (no lockeado)
    function getAvailableBond(address lp) external view returns (uint256) {
        return lpBonds[lp] - lockedBonds[lp];
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // ============================================
    // FUNCIONES DE ADMINISTRACIÓN (ONLY OWNER)
    // ============================================
    
    function setTestChallengePeriod(uint256 newPeriod) external onlyOwner {
        require(newPeriod >= 60, "Period too short (min 60 seconds)");
        testChallengePeriod = newPeriod;
    }
    
    function setFeePercentage(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high (max 10%)");
        uint256 oldFee = feePercentage;
        feePercentage = newFee;
        emit FeePercentageChanged(oldFee, newFee);
    }
    
    function setMinimumBond(uint256 newMinimum) external onlyOwner {
        require(newMinimum > 0, "Minimum bond must be positive");
        minimumBond = newMinimum;
    }
    
    function setMaxRequestsPerUser(uint256 newMax) external onlyOwner {
        require(newMax > 0, "Max must be positive");
        maxRequestsPerUser = newMax;
    }
    
    // Nuevo: Pausa de emergencia
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
}

