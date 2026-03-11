export enum AwsRouts {
  DOWNLOAD = 'downloadClick',
  PORTFOLIO = 'portfolio'
}



export class LambdaService{
  
  static async EmailServiceLambda(data:Record<string,string>={}) {
    try {
      const res = await fetch(`${import.meta.env.VITE_EMAIL_SERVICE_LAMBDA}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${import.meta.env.VITE_API_KEY_EMAIL_SERVICE}`
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

  static async DataAnalytics(data){
    try {
      console.log(data.awsRoute)
        const res = await fetch(`${import.meta.env.VITE_DATA_ANALYTICS_URL}/${data.awsRoute}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${import.meta.env.VITE_API_KEY_ANALYTICS}`
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

  static async regressionTest(repo:string){
    try {
        
        const res = await fetch(`${import.meta.env.VITE_AUTHOMATION_URL_TRIGER}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${import.meta.env.VITE_API_KEY_REGRESSION}`
          },
          body: JSON.stringify({repo}),
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

}