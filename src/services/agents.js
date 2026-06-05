export async function evaluateApplication(messages) {
  try {
    const response = await fetch('/api/agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) throw new Error('Agent service down');
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Frontend Agent Call Error:", error);
    return "[ Agent temporarily unavailable — please try again ]";
  }
}
