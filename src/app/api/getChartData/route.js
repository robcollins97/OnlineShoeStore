export async function GET(req, res) {

    // Make a note we are on
    // the api. This goes to the console.
    console.log("in the api page")

  
  
    
  
   //==========================================================
  
   // query the database and count the records for one candidate.

   // put the result in result1 variable

   // do another query for the second candidate and put the count into result 2 variabl.

   // what we send back is [result1, result2, 12, 23, 23]
  
  
  // return Response.json([resul1, result2, 3, 5, 2, 3])
    // at the end of the process we need to send something back.
    return Response.json([12, 19, 3, 5, 2, 3])


   
  }
  
  