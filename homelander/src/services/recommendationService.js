export async function getRecommendations(accountId) {
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId }),
      });
      
      const data = await response.json();
      return data.recommendations;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return null;
    }
  }
