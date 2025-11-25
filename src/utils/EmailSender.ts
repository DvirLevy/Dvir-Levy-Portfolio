async function EmailServiceLambda(data:Record<string,string>={}) {
    try {
      const res = await fetch(process.env.EMAIL_SERVICE_LAMBDA, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_LAMBDA_API_KEY
        },
        body: JSON.stringify(data),
      });
  
      if (!res.ok) {
        throw new Error("Lambda responded with an error");
      }
  
      const result = await res.json();
      return result;
    } catch (error) {
      console.error("Lambda error:", error);
      throw error;
    }
}

export default EmailServiceLambda