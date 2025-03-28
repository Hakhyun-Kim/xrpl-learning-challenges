{
    "id": "connect",
    "title": "Challenge 1: Connect to the XRP Ledger",
    "description": "In this challenge, you need to connect to the XRP Ledger TestNet. Fill in the missing parameter in the connectToLedger function.",
    "code": "async function connectToLedger() {\n  // CHALLENGE: Replace 'YOUR_TESTNET_URL' with the correct WebSocket URL for the XRP Ledger TestNet\n  const client = new xrpl.Client('YOUR_TESTNET_URL');\n  \n  try {\n    await client.connect();\n    return client;\n  } catch (error) {\n    console.error(\"Connection error:\", error);\n    throw error;\n  }\n}\n\n// Test the connection\nasync function testConnection() {\n  try {\n    const client = await connectToLedger();\n    console.log(\"Successfully connected to the XRP Ledger!\");\n    \n    // Get server info to verify connection\n    const serverInfo = await client.request({\n      command: \"server_info\"\n    });\n    \n    console.log(\"Server info:\", serverInfo.result.info.build_version);\n    client.disconnect();\n    return true;\n  } catch (error) {\n    console.error(\"Test failed:\", error);\n    return false;\n  }\n}\n\n// Run the test\ntestConnection();",
    "solution": "wss://s.altnet.rippletest.net:51233",
    "hint": "The XRP Ledger TestNet is accessible via the WebSocket URL: wss://s.altnet.rippletest.net:51233"
  }