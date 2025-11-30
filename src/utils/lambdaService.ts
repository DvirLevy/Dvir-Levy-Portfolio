export class LambdaService{

static async EmailServiceLambda(data:Record<string,string>={}) {
  console.log("from EmailServiceLambda")
    try {
      const res = await fetch('https://rm0q9is55k.execute-api.eu-north-1.amazonaws.com/prod', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "86CU147qhP3sA8Fvh9QJv5Wg0a4X2gVx7Kx8MJ2C"
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

static async DataAnalytics(){
  try {
      const res = await fetch('https://y7tmcxw46c.execute-api.eu-north-1.amazonaws.com/prod', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "GwGr93ZIeC5vGnx4eg4ow3dbkK1wuECC1sGeWQx2"
        },
        // body: JSON.stringify(data),
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