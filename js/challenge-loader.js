/**
 * Challenge Loader
 * Responsible for loading and managing challenge data
 */
const ChallengeLoader = (function() {
  // Store challenges data
  let challenges = [];
  
  /**
   * Load all challenges
   * @returns {Promise} Promise that resolves when challenges are loaded
   */
  function loadChallenges() {
      return new Promise(async (resolve, reject) => {
          try {
              // In a real application, we would dynamically load these from separate files
              // For the example, we'll load the challenges directly here
              
              const challengeFiles = [
                  'challenges/challenge-1.js',
                  'challenges/challenge-2.js',
                  'challenges/challenge-3.js',
                  'challenges/challenge-4.js',
                  'challenges/challenge-5.js'
              ];
              
              try {
                  // Try to load challenges from separate files
                  const loadedChallenges = await Promise.all(
                      challengeFiles.map(file => 
                          fetch(file)
                              .then(response => {
                                  if (!response.ok) {
                                      throw new Error(`Failed to load ${file}`);
                                  }
                                  return response.json();
                              })
                      )
                  );
                  
                  challenges = loadedChallenges;
              } catch (error) {
                  console.warn('Failed to load challenges from files, falling back to built-in challenges:', error);
                  
                  // If loading from files fails, use built-in challenges
                  challenges = getBuiltInChallenges();
              }
              
              console.log(`Loaded ${challenges.length} challenges`);
              resolve(challenges);
          } catch (error) {
              console.error('Error loading challenges:', error);
              reject(error);
          }
      });
  }
  
  /**
   * Get the loaded challenges
   * @returns {Array} Array of challenge objects
   */
  function getChallenges() {
      return challenges;
  }
  
  /**
   * Get a challenge by ID
   * @param {string} id - Challenge ID
   * @returns {Object|null} Challenge object or null if not found
   */
  function getChallengeById(id) {
      return challenges.find(challenge => challenge.id === id) || null;
  }
  
  /**
   * Get built-in challenges (fallback)
   * @returns {Array} Array of challenge objects
   */
  function getBuiltInChallenges() {
      return [
          {
              id: 'connect',
              title: 'Challenge 1: Connect to the XRP Ledger',
              description: `In this challenge, you need to connect to the XRP Ledger TestNet. 
                            Fill in the missing parameter in the connectToLedger function.`,
              code: `async function connectToLedger() {
// CHALLENGE: Replace 'YOUR_TESTNET_URL' with the correct WebSocket URL for the XRP Ledger TestNet
const client = new xrpl.Client('YOUR_TESTNET_URL');

try {
  await client.connect();
  return client;
} catch (error) {
  console.error("Connection error:", error);
  throw error;
}
}

// Test the connection
async function testConnection() {
try {
  const client = await connectToLedger();
  console.log("Successfully connected to the XRP Ledger!");
  
  // Get server info to verify connection
  const serverInfo = await client.request({
    command: "server_info"
  });
  
  console.log("Server info:", serverInfo.result.info.build_version);
  client.disconnect();
  return true;
} catch (error) {
  console.error("Test failed:", error);
  return false;
}
}

// Run the test
testConnection();`,
              solution: 'wss://s.altnet.rippletest.net:51233',
              hint: 'The XRP Ledger TestNet is accessible via the WebSocket URL: wss://s.altnet.rippletest.net:51233'
          },
          {
              id: 'wallet',
              title: 'Challenge 2: Create a TestNet Wallet',
              description: `Now that we can connect to the TestNet, let's create a new funded wallet.
                            Complete the createTestWallet function to generate a new wallet and fund it using the TestNet faucet.`,
              code: `async function connectToLedger() {
const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
await client.connect();
return client;
}

async function createTestWallet(client) {
try {
  // CHALLENGE: Use the client to create a funded wallet on the TestNet
  // HINT: Look up the fundWallet method
  
  // Replace this line with your code
  const fundedWallet = null;
  
  console.log("Wallet created with address:", fundedWallet.wallet.address);
  console.log("Wallet has balance:", await getXRPBalance(client, fundedWallet.wallet.address));
  
  return fundedWallet.wallet;
} catch (error) {
  console.error("Error creating wallet:", error);
  throw error;
}
}

async function getXRPBalance(client, address) {
const response = await client.request({
  command: "account_info",
  account: address,
  ledger_index: "validated"
});

return xrpl.dropsToXrp(response.result.account_data.Balance);
}

// Test the wallet creation
async function testWalletCreation() {
let client;
try {
  client = await connectToLedger();
  const wallet = await createTestWallet(client);
  console.log("Test successful! Created wallet with address:", wallet.address);
  return true;
} catch (error) {
  console.error("Test failed:", error);
  return false;
} finally {
  if (client) client.disconnect();
}
}

// Run the test
testWalletCreation();`,
              solution: `const fundedWallet = await client.fundWallet();`,
              hint: 'Use client.fundWallet() to generate a new wallet and fund it with the TestNet faucet.'
          },
          {
              id: 'send-xrp',
              title: 'Challenge 3: Send XRP Payment',
              description: `Let's create a function to send XRP from one wallet to another.
                            Complete the sendXRP function by filling in the missing transaction details.`,
              code: `async function connectToLedger() {
const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
await client.connect();
return client;
}

async function sendXRP(client, senderWallet, destinationAddress, amount) {
try {
  // CHALLENGE: Create a Payment transaction to send XRP
  // Convert the amount to drops (XRP's smallest unit)
  const drops = xrpl.xrpToDrops(amount);
  
  // CHALLENGE: Construct the payment transaction object with:
  // - TransactionType: 'Payment'
  // - Account: sender's address
  // - Destination: recipient's address
  // - Amount: amount in drops
  
  // Replace this with your payment transaction object
  const payment = {
    // Fill in the required properties here
  };
  
  // Prepare, sign, and submit the transaction
  const prepared = await client.autofill(payment);
  const signed = senderWallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  
  if (result.result.meta.TransactionResult === "tesSUCCESS") {
    console.log(\`Payment of \${amount} XRP sent successfully to \${destinationAddress}\`);
    console.log(\`Transaction hash: \${result.result.hash}\`);
    return true;
  } else {
    console.error("Transaction failed:", result.result.meta.TransactionResult);
    return false;
  }
} catch (error) {
  console.error("Error sending XRP:", error);
  return false;
}
}

// Test sending XRP
async function testSendXRP() {
let client;
try {
  client = await connectToLedger();
  
  // Create two test wallets
  const wallet1 = (await client.fundWallet()).wallet;
  const wallet2 = (await client.fundWallet()).wallet;
  
  console.log("Sender address:", wallet1.address);
  console.log("Receiver address:", wallet2.address);
  
  // Send 10 XRP from wallet1 to wallet2
  const success = await sendXRP(client, wallet1, wallet2.address, "10");
  
  if (success) {
    console.log("Payment test completed successfully!");
  } else {
    console.log("Payment test failed.");
  }
  
  return success;
} catch (error) {
  console.error("Test failed:", error);
  return false;
} finally {
  if (client) client.disconnect();
}
}

// Run the test
testSendXRP();`,
              solution: `const payment = {
TransactionType: 'Payment',
Account: senderWallet.address,
Destination: destinationAddress,
Amount: drops
};`,
              hint: 'The payment object should have 4 properties: TransactionType ("Payment"), Account (sender\'s address), Destination (recipient\'s address), and Amount (the XRP amount in drops).'
          },
          {
              id: 'check-transaction',
              title: 'Challenge 4: Verify Transaction Status',
              description: `Let's create a function to check the status of a transaction.
                            Complete the checkTransaction function to retrieve and verify a transaction by its hash.`,
              code: `async function connectToLedger() {
const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
await client.connect();
return client;
}

async function checkTransaction(client, transactionHash) {
try {
  // CHALLENGE: Create a request to fetch transaction information
  // - Use the 'tx' command
  // - Include the transaction hash
  
  // Replace this with your request object
  const request = {
    // Fill in the required properties here
  };
  
  const response = await client.request(request);
  
  // Process and display transaction information
  if (response.result.validated) {
    console.log("Transaction found!");
    console.log("Status:", response.result.meta.TransactionResult);
    
    if (response.result.TransactionType === "Payment") {
      const amount = response.result.Amount;
      const isXRP = typeof amount === "string";
      
      if (isXRP) {
        console.log("Payment amount:", xrpl.dropsToXrp(amount), "XRP");
      } else {
        console.log("Payment is for an issued currency");
      }
      
      console.log("From:", response.result.Account);
      console.log("To:", response.result.Destination);
    }
    
    return true;
  } else {
    console.log("Transaction not yet validated");
    return false;
  }
} catch (error) {
  console.error("Error checking transaction:", error);
  return false;
}
}

// Test checking a transaction
async function testCheckTransaction() {
let client;
try {
  client = await connectToLedger();
  
  // We'll send a transaction to get a transaction hash to check
  const wallet1 = (await client.fundWallet()).wallet;
  const wallet2 = (await client.fundWallet()).wallet;
  
  // Send a payment to get a hash
  const payment = {
    TransactionType: 'Payment',
    Account: wallet1.address,
    Destination: wallet2.address,
    Amount: xrpl.xrpToDrops("5")
  };
  
  const prepared = await client.autofill(payment);
  const signed = wallet1.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  
  const txHash = result.result.hash;
  console.log("Created transaction with hash:", txHash);
  
  // Now check the transaction
  const success = await checkTransaction(client, txHash);
  
  if (success) {
    console.log("Transaction check completed successfully!");
  } else {
    console.log("Transaction check failed.");
  }
  
  return success;
} catch (error) {
  console.error("Test failed:", error);
  return false;
} finally {
  if (client) client.disconnect();
}
}

// Run the test
testCheckTransaction();`,
              solution: `const request = {
command: 'tx',
transaction: transactionHash
};`,
              hint: 'The request object should have 2 properties: command (set to "tx") and transaction (the transaction hash you want to look up).'
          },
          {
              id: 'escrow',
              title: 'Challenge 5: Create an Escrow',
              description: `Let's create an escrow payment. Escrows are time-locked payments that can be released after a specific time.
                            Complete the createEscrow function to set up a time-based escrow payment.`,
              code: `async function connectToLedger() {
const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
await client.connect();
return client;
}

async function createEscrow(client, senderWallet, destinationAddress, amount, finishAfter) {
try {
  // Convert the amount to drops
  const drops = xrpl.xrpToDrops(amount);
  
  // Calculate finish time (finishAfter is in seconds from now)
  const date = new Date();
  date.setSeconds(date.getSeconds() + finishAfter);
  
  // CHALLENGE: Create an EscrowCreate transaction
  // - TransactionType: 'EscrowCreate'
  // - Account: sender's address
  // - Destination: recipient's address
  // - Amount: amount in drops
  // - FinishAfter: ripple time when the escrow can be finished (use xrpl.isoTimeToRippleTime())
  
  // Replace this with your escrow transaction object
  const escrowCreate = {
    // Fill in the required properties here
  };
  
  // Prepare, sign, and submit the transaction
  const prepared = await client.autofill(escrowCreate);
  const signed = senderWallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  
  if (result.result.meta.TransactionResult === "tesSUCCESS") {
    console.log(\`Escrow created successfully!\`);
    console.log(\`Sequence number (needed for finishing): \${prepared.Sequence}\`);
    console.log(\`Transaction hash: \${result.result.hash}\`);
    return {
      success: true,
      sequence: prepared.Sequence,
      hash: result.result.hash
    };
  } else {
    console.error("Transaction failed:", result.result.meta.TransactionResult);
    return { success: false };
  }
} catch (error) {
  console.error("Error creating escrow:", error);
  return { success: false };
}
}

// Test creating an escrow
async function testCreateEscrow() {
let client;
try {
  client = await connectToLedger();
  
  // Create two test wallets
  const wallet1 = (await client.fundWallet()).wallet;
  const wallet2 = (await client.fundWallet()).wallet;
  
  console.log("Sender address:", wallet1.address);
  console.log("Receiver address:", wallet2.address);
  
  // Create an escrow that can be finished after 60 seconds
  const result = await createEscrow(client, wallet1, wallet2.address, "20", 60);
  
  if (result.success) {
    console.log("Escrow test completed successfully!");
  } else {
    console.log("Escrow test failed.");
  }
  
  return result.success;
} catch (error) {
  console.error("Test failed:", error);
  return false;
} finally {
  if (client) client.disconnect();
}
}

// Run the test
testCreateEscrow();`,
              solution: `const escrowCreate = {
TransactionType: 'EscrowCreate',
Account: senderWallet.address,
Destination: destinationAddress,
Amount: drops,
FinishAfter: xrpl.isoTimeToRippleTime(date.toISOString())
};`,
              hint: 'The escrowCreate object needs 5 properties: TransactionType ("EscrowCreate"), Account (sender\'s address), Destination (recipient\'s address), Amount (drops), and FinishAfter (ripple time calculated with xrpl.isoTimeToRippleTime()).'
          }
      ];
  }
  
  // Public API
  return {
      loadChallenges,
      getChallenges,
      getChallengeById
  };
})();