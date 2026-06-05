// General service handler for backend coordination
async function callAgentService(messages, agentRole) {
  try {
    // Append a system instruction or role payload if needed by your pipeline
    const payload = [
      { role: "system", content: `You are the Ujima SACCO ${agentRole} agent.` },
      ...messages
    ];

    const response = await fetch('/api/agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: payload })
    });

    if (!response.ok) throw new Error('Agent service down');
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(`Frontend ${agentRole} Call Error:`, error);
    return `[ ${agentRole} temporarily unavailable — please try again ]`;
  }
}

// Export the explicit functions required by AgentPanel.jsx
export async function runScout(messages) {
  return callAgentService(messages, "Scout");
}

export async function runGuardian(messages) {
  return callAgentService(messages, "Guardian");
}

export async function runHunter(messages) {
  return callAgentService(messages, "Hunter");
}
