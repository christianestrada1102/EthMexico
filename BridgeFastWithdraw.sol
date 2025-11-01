// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BridgeFastWithdraw
 * @notice Sistema de retiros rápidos para reducir el tiempo de espera del puente L2→L1
 * @dev Permite a los usuarios recibir fondos inmediatamente a cambio de una comisión,
 *      mientras los proveedores de liquidez esperan el periodo de challenge oficial
 * 
 * Flujo del sistema:
 * 1. Usuario solicita retiro y lockea fondos en el contrato
 * 2. Proveedor de liquidez (LP) adelanta los fondos al usuario (menos comisión)
 * 3. Después del challenge period (7 días), LP recupera fondos + comisión
 * 
 * Para el hackathon de Arbitrum Stylus
 */
contract BridgeFastWithdraw {
    
    // ============================================
    // ESTRUCTURAS DE DATOS
    // ============================================
    
    /**
     * @notice Estructura que representa una solicitud de retiro
     * @dev Contiene toda la información necesaria para rastrear el ciclo de vida del retiro
     */
    struct WithdrawalRequest {
        address user;                   // Usuario que solicita el retiro
        uint256 amount;                 // Monto total a retirar (en wei)
        uint256 timestamp;              // Cuándo se solicitó el retiro
        uint256 challengePeriodEnd;     // Timestamp cuando termina el periodo de challenge
        address liquidityProvider;      // LP que adelantó los fondos (address(0) si nadie)
        bool isAdvanced;                // True si un LP ya adelantó los fondos
        bool isFinalized;               // True si el retiro ya se completó oficialmente
        uint256 fee;                    // Comisión pagada al LP (en wei)
    }
    
    // ============================================
    // VARIABLES DE ESTADO
    // ============================================
    
    /// @notice Mapeo de ID de solicitud a datos de la solicitud
    mapping(uint256 => WithdrawalRequest) public withdrawals;
    
    /// @notice Contador auto-incremental para IDs de solicitudes
    uint256 public withdrawalCounter;
    
    /// @notice Comisión expresada en basis points (100 = 1%, 1000 = 10%)
    /// @dev Usamos basis points para evitar problemas de redondeo
    uint256 public feePercentage = 100; // 1% por defecto
    
    /// @notice Periodo de challenge en producción (7 días)
    uint256 public constant CHALLENGE_PERIOD = 7 days;
    
    /// @notice Periodo de challenge para testing (configurable)
    /// @dev En testing puedes cambiar esto a 2 minutos con setTestChallengePeriod()
    uint256 public testChallengePeriod = 7 days;
    
    /// @notice Bond mínimo que debe depositar un LP para participar
    /// @dev Protege contra comportamiento malicioso
    uint256 public minimumBond = 0.1 ether;
    
    /// @notice Mapeo de dirección de LP a su bond depositado
    mapping(address => uint256) public lpBonds;
    
    // ============================================
    // EVENTOS
    // ============================================
    
    /**
     * @notice Se emite cuando un usuario solicita un retiro
     * @param requestId ID único de la solicitud
     * @param user Dirección del usuario
     * @param amount Monto solicitado
     * @param challengePeriodEnd Timestamp cuando termina el periodo de espera
     */
    event WithdrawalRequested(
        uint256 indexed requestId,
        address indexed user,
        uint256 amount,
        uint256 challengePeriodEnd
    );
    
    /**
     * @notice Se emite cuando un LP adelanta fondos a un usuario
     * @param requestId ID de la solicitud
     * @param liquidityProvider Dirección del LP
     * @param amount Monto adelantado
     * @param fee Comisión ganada por el LP
     */
    event LiquidityProvided(
        uint256 indexed requestId,
        address indexed liquidityProvider,
        uint256 amount,
        uint256 fee
    );
    
    /**
     * @notice Se emite cuando un LP recupera sus fondos después del challenge period
     * @param requestId ID de la solicitud
     * @param liquidityProvider Dirección del LP
     * @param amount Monto total recibido (capital + comisión)
     */
    event WithdrawalFinalized(
        uint256 indexed requestId,
        address indexed liquidityProvider,
        uint256 amount
    );
    
    /**
     * @notice Se emite cuando un LP deposita un bond
     * @param liquidityProvider Dirección del LP
     * @param amount Monto del bond
     */
    event BondDeposited(
        address indexed liquidityProvider,
        uint256 amount
    );
    
    /**
     * @notice Se emite cuando un LP retira su bond
     * @param liquidityProvider Dirección del LP
     * @param amount Monto retirado
     */
    event BondWithdrawn(
        address indexed liquidityProvider,
        uint256 amount
    );
    
    /**
     * @notice Se emite cuando se cambia el porcentaje de comisión
     * @param oldFee Comisión anterior
     * @param newFee Nueva comisión
     */
    event FeePercentageChanged(
        uint256 oldFee,
        uint256 newFee
    );
    
    // ============================================
    // FUNCIONES PRINCIPALES
    // ============================================
    
    /**
     * @notice Permite a los LPs depositar un bond para poder proveer liquidez
     * @dev El bond protege al sistema contra comportamiento malicioso
     * 
     * Ejemplo de uso en Remix:
     * 1. Selecciona una cuenta que será LP
     * 2. En el campo "VALUE", ingresa 0.1 (o más) y selecciona "ether"
     * 3. Llama a depositBond()
     */
    function depositBond() external payable {
        require(msg.value > 0, "Must deposit something");
        lpBonds[msg.sender] += msg.value;
        emit BondDeposited(msg.sender, msg.value);
    }
    
    /**
     * @notice Permite a los LPs retirar su bond
     * @param amount Cantidad a retirar (en wei)
     * 
     * Ejemplo de uso:
     * withdrawBond(100000000000000000) // Retira 0.1 ETH
     */
    function withdrawBond(uint256 amount) external {
        require(lpBonds[msg.sender] >= amount, "Insufficient bond");
        lpBonds[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit BondWithdrawn(msg.sender, amount);
    }
    
    /**
     * @notice Permite a un usuario solicitar un retiro rápido
     * @dev El usuario envía ETH que será lockeado hasta que se complete el proceso
     * 
     * Ejemplo de uso en Remix:
     * 1. Selecciona la cuenta del usuario
     * 2. En "VALUE", ingresa 1 y selecciona "ether"
     * 3. Llama a requestWithdrawal()
     * 4. Observa el evento WithdrawalRequested para obtener el requestId
     */
    function requestWithdrawal() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        
        // Crear nuevo ID de solicitud
        uint256 requestId = withdrawalCounter++;
        
        // Calcular cuando termina el challenge period
        uint256 challengeEnd = block.timestamp + testChallengePeriod;
        
        // Crear la solicitud
        withdrawals[requestId] = WithdrawalRequest({
            user: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            challengePeriodEnd: challengeEnd,
            liquidityProvider: address(0),
            isAdvanced: false,
            isFinalized: false,
            fee: 0
        });
        
        emit WithdrawalRequested(requestId, msg.sender, msg.value, challengeEnd);
    }
    
    /**
     * @notice Permite a un LP adelantar fondos a un usuario
     * @param requestId ID de la solicitud de retiro a cubrir
     * @dev El LP debe:
     *      1. Tener un bond depositado >= minimumBond
     *      2. Enviar suficiente ETH para cubrir el retiro
     *      El usuario recibe inmediatamente (amount - fee)
     * 
     * Ejemplo de uso en Remix:
     * 1. Selecciona la cuenta del LP (que ya depositó bond)
     * 2. En "VALUE", ingresa el monto que solicitó el usuario (ej: 1 ether)
     * 3. Llama a provideLiquidity(0) // 0 es el requestId
     * 4. El usuario recibe su dinero inmediatamente menos la comisión
     */
    function provideLiquidity(uint256 requestId) external payable {
        WithdrawalRequest storage request = withdrawals[requestId];
        
        // Validaciones
        require(request.amount > 0, "Request does not exist");
        require(!request.isAdvanced, "Already advanced");
        require(!request.isFinalized, "Already finalized");
        require(lpBonds[msg.sender] >= minimumBond, "Insufficient bond - deposit bond first");
        
        // Calcular comisión
        // Fórmula: fee = (amount * feePercentage) / 10000
        // Ejemplo: si amount = 1 ETH y feePercentage = 100 (1%)
        //          fee = (1 * 100) / 10000 = 0.01 ETH
        uint256 fee = (request.amount * feePercentage) / 10000;
        uint256 amountToUser = request.amount - fee;
        
        require(msg.value >= request.amount, "Insufficient liquidity provided");
        
        // Actualizar estado de la solicitud
        request.isAdvanced = true;
        request.liquidityProvider = msg.sender;
        request.fee = fee;
        
        // Pagar al usuario inmediatamente (este es el "fast withdrawal")
        payable(request.user).transfer(amountToUser);
        
        // Si el LP envió de más, devolver el exceso
        if (msg.value > request.amount) {
            payable(msg.sender).transfer(msg.value - request.amount);
        }
        
        emit LiquidityProvided(requestId, msg.sender, request.amount, fee);
    }
    
    /**
     * @notice Finaliza un retiro después del challenge period
     * @param requestId ID de la solicitud a finalizar
     * @dev Solo se puede llamar después de que termine el challenge period
     *      El LP recupera su capital + la comisión
     * 
     * Ejemplo de uso en Remix:
     * 1. Espera que pase el challenge period (o ajústalo para testing)
     * 2. Cualquier cuenta puede llamar a finalizeWithdrawal(0)
     * 3. El LP recibe su capital + comisión
     */
    function finalizeWithdrawal(uint256 requestId) external {
        WithdrawalRequest storage request = withdrawals[requestId];
        
        // Validaciones
        require(request.amount > 0, "Request does not exist");
        require(request.isAdvanced, "Not advanced yet");
        require(!request.isFinalized, "Already finalized");
        require(
            block.timestamp >= request.challengePeriodEnd,
            "Challenge period not ended yet"
        );
        
        // Marcar como finalizado
        request.isFinalized = true;
        
        // Calcular el total a devolver al LP
        // El LP recupera: lo que adelantó (amount) + su comisión (fee)
        // Los fondos originales del usuario (que están en el contrato) se usan aquí
        uint256 totalReturn = request.amount + request.fee;
        
        // Transferir al LP
        payable(request.liquidityProvider).transfer(totalReturn);
        
        emit WithdrawalFinalized(requestId, request.liquidityProvider, totalReturn);
    }
    
    // ============================================
    // FUNCIONES DE CONSULTA (VIEW)
    // ============================================
    
    /**
     * @notice Obtiene los detalles completos de una solicitud
     * @param requestId ID de la solicitud
     * @return Estructura WithdrawalRequest con todos los datos
     */
    function getWithdrawal(uint256 requestId) external view returns (WithdrawalRequest memory) {
        return withdrawals[requestId];
    }
    
    /**
     * @notice Calcula cuánto tiempo falta para finalizar un retiro
     * @param requestId ID de la solicitud
     * @return Segundos restantes (0 si ya se puede finalizar)
     */
    function getTimeRemaining(uint256 requestId) external view returns (uint256) {
        WithdrawalRequest memory request = withdrawals[requestId];
        if (block.timestamp >= request.challengePeriodEnd) {
            return 0;
        }
        return request.challengePeriodEnd - block.timestamp;
    }
    
    /**
     * @notice Calcula cuánta comisión se cobraría por un monto dado
     * @param amount Monto del retiro
     * @return fee Comisión que se cobraría
     */
    function calculateFee(uint256 amount) external view returns (uint256 fee) {
        fee = (amount * feePercentage) / 10000;
    }
    
    /**
     * @notice Verifica si un LP tiene suficiente bond
     * @param lp Dirección del LP
     * @return True si el LP puede proveer liquidez
     */
    function canProvideLiquidity(address lp) external view returns (bool) {
        return lpBonds[lp] >= minimumBond;
    }
    
    // ============================================
    // FUNCIONES DE ADMINISTRACIÓN
    // ============================================
    /**
     * @notice Cambia el challenge period para testing
     * @param newPeriod Nuevo periodo en segundos
     * @dev Solo para testing. En producción sería onlyOwner y se usaría CHALLENGE_PERIOD
     * 
     * Ejemplo para testing rápido:
     * setTestChallengePeriod(120) // 2 minutos
     * setTestChallengePeriod(60)  // 1 minuto
     */
    function setTestChallengePeriod(uint256 newPeriod) external {
        require(newPeriod >= 60, "Period too short (min 60 seconds)");
        testChallengePeriod = newPeriod;
    }
    
    /**
     * @notice Cambia el porcentaje de comisión
     * @param newFee Nueva comisión en basis points (100 = 1%)
     * @dev En producción sería onlyOwner
     */
    function setFeePercentage(uint256 newFee) external {
        require(newFee <= 1000, "Fee too high (max 10%)");
        uint256 oldFee = feePercentage;
        feePercentage = newFee;
        emit FeePercentageChanged(oldFee, newFee);
    }
    
    /**
     * @notice Cambia el bond mínimo requerido
     * @param newMinimum Nuevo mínimo en wei
     */
    function setMinimumBond(uint256 newMinimum) external {
        require(newMinimum > 0, "Minimum bond must be positive");
        minimumBond = newMinimum;
    }
    
    /**
     * @notice Permite ver el balance del contrato
     * @return Balance en wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

