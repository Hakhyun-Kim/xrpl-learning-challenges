/**
 * Test Runner
 * Validates user code against challenge requirements
 */
const TestRunner = (function() {
    /**
     * Run a test for a specific challenge
     * @param {Object} challenge - Challenge object
     * @param {string} code - User's code
     * @returns {Promise} Promise resolving to test result
     */
    function runTest(challenge, code) {
        return new Promise((resolve, reject) => {
            try {
                // Validate code based on the challenge id
                switch (challenge.id) {
                    case 'connect':
                        validateConnectChallenge(code, resolve);
                        break;
                    case 'wallet':
                        validateWalletChallenge(code, resolve);
                        break;
                    case 'send-xrp':
                        validateSendXRPChallenge(code, resolve);
                        break;
                    case 'check-transaction':
                        validateCheckTransactionChallenge(code, resolve);
                        break;
                    case 'escrow':
                        validateEscrowChallenge(code, resolve);
                        break;
                    default:
                        reject(new Error(`Unknown challenge: ${challenge.id}`));
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * Validate Challenge 1: Connect to XRPL
     * @param {string} code - User's code
     * @param {Function} resolve - Promise resolve function
     */
    function validateConnectChallenge(code, resolve) {
        const testNetUrlRegex = /new xrpl\.Client\(['"](wss:\/\/s\.altnet\.rippletest\.net(:51233)?)['"]\)/;
        const isCorrect = testNetUrlRegex.test(code);
        
        if (isCorrect) {
            resolve({
                success: true,
                output: 'You successfully connected to the XRP Ledger TestNet!'
            });
        } else {
            resolve({
                success: false,
                error: 'Your solution doesn\'t include the correct TestNet URL. Make sure to use "wss://s.altnet.rippletest.net:51233".'
            });
        }
    }
    
    /**
     * Validate Challenge 2: Create TestNet Wallet
     * @param {string} code - User's code
     * @param {Function} resolve - Promise resolve function
     */
    function validateWalletChallenge(code, resolve) {
        const fundWalletRegex = /const\s+fundedWallet\s+=\s+await\s+client\.fundWallet\(\s*\)/;
        const isCorrect = fundWalletRegex.test(code);
        
        if (isCorrect) {
            resolve({
                success: true,
                output: 'You successfully created a funded wallet on the TestNet!'
            });
        } else {
            resolve({
                success: false,
                error: 'Your solution doesn\'t use the correct method to fund a wallet. Make sure to use "client.fundWallet()".'
            });
        }
    }
    
    /**
     * Validate Challenge 3: Send XRP Payment
     * @param {string} code - User's code
     * @param {Function} resolve - Promise resolve function
     */
    function validateSendXRPChallenge(code, resolve) {
        const isCorrect = 
            code.includes('TransactionType: \'Payment\'') && 
            code.includes('Account: senderWallet.address') && 
            code.includes('Destination: destinationAddress') && 
            code.includes('Amount: drops');
        
        if (isCorrect) {
            resolve({
                success: true,
                output: 'You successfully created a payment transaction with all required fields!'
            });
        } else {
            resolve({
                success: false,
                error: 'Your payment object is missing one or more required properties (TransactionType, Account, Destination, Amount).'
            });
        }
    }
    
    /**
     * Validate Challenge 4: Check Transaction
     * @param {string} code - User's code
     * @param {Function} resolve - Promise resolve function
     */
    function validateCheckTransactionChallenge(code, resolve) {
        const isCorrect = 
            code.includes('command: \'tx\'') && 
            code.includes('transaction: transactionHash');
        
        if (isCorrect) {
            resolve({
                success: true,
                output: 'You successfully created a request to check a transaction status!'
            });
        } else {
            resolve({
                success: false,
                error: 'Your request object is missing one or more required properties (command, transaction).'
            });
        }
    }
    
    /**
     * Validate Challenge 5: Create Escrow
     * @param {string} code - User's code
     * @param {Function} resolve - Promise resolve function
     */
    function validateEscrowChallenge(code, resolve) {
        const isCorrect = 
            code.includes('TransactionType: \'EscrowCreate\'') && 
            code.includes('Account: senderWallet.address') && 
            code.includes('Destination: destinationAddress') && 
            code.includes('Amount: drops') &&
            code.includes('FinishAfter: xrpl.isoTimeToRippleTime');
        
        if (isCorrect) {
            resolve({
                success: true,
                output: 'You successfully created an escrow transaction with all required fields!'
            });
        } else {
            resolve({
                success: false,
                error: 'Your escrow object is missing one or more required properties (TransactionType, Account, Destination, Amount, FinishAfter).'
            });
        }
    }
    
    // Public API
    return {
        runTest
    };
})();