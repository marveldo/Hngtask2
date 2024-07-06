


const axios = require("axios")
jest.mock("axios")



const BaseUrl = "http://127.0.0.1:8000"

const mockregisterationdetails = {
   "status": "success",
   "message": "Registeration Succesful",
   "data": {
    'accessToken': "yryryryryryyryrggbgbgbgbgbgb",
   "user": {userId: "23futu6879yjnrjeemne",
    firstName : "Andrew", 
    lastName : "Adeleye", 
    email : "andyadeleye@gmail.com", 
    phone : "08102980007", 
    password : "leye123"}
                   }
}

const failedmockregistertiondetails = {
    "errors": [
      {
        "field": "string",
        "message": "string"
      },
    ]
  }

const mocklogindetails = {
    "status": "success",
    "message": "Login Successful",
    "data": {
     'accessToken': "yryryryryryyryrggbgbgbgbgbgb",
    "user": {userId: "23futu6879yjnrjeemne",
     firstName : "Andrew", 
     lastName : "Adeleye", 
     email : "andyadeleye@gmail.com", 
     phone : "08102980007", 
     password : "leye123"}
 }
}

const failedmocklogindetails = {
    "errors": [
      {
        "field": "string",
        "message": "string"
      },
    ]
  }

const failedpassworddetails = {
    "status": "Bad request",
    "message": "Authentication failed",
    "statusCode": 401
}


const register = async(data) => {
    // Simulating successful  Response
    axios.post.mockResolvedValueOnce({data : mockregisterationdetails})
    const response = await axios.post(`${BaseUrl}/auth/register`, data)
    
    return response.data
}

const registerwitherror = async(data) => {
    //Simulating error response
    axios.post.mockRejectedValueOnce({data : failedmockregistertiondetails})
    try{
      const response =  await axios.post(`${BaseUrl}/auth/register`, data)
    }catch(error){
       
        return error
    }
}

const login = async(data) => {
    //Simulating successful response
    axios.post.mockResolvedValueOnce({data : mocklogindetails})
    const response = await axios.post(`${BaseUrl}/auth/login`, data)
  
    return response.data
}

const loginwithwrongpassword = async(data) => {
    axios.post.mockRejectedValueOnce({data : failedpassworddetails})
    try{
        const response = await axios.post(`${BaseUrl}/auth/login`,data)
    }catch(error){
       
        return error
    }
}

const loginwithmissingrequiredfield = async(data) => {
    axios.post.mockRejectedValueOnce({data : failedmocklogindetails})
    try{
        const response = await axios.post(`${BaseUrl}/auth/login`,data)
    }
    catch(error){
       
        return error
    }
}



describe('Registeration Endpoint', ()=> {
    it('it should successfully register a user', async()=> {
        const user_data = {firstName : "Andrew", lastName : "Adeleye", email : "andyadeleye@gmail.com", phone : "08102980007", password : "leye123"}
        const registereduser = await register(user_data)
        expect(registereduser).toEqual(mockregisterationdetails)

    })
    it('it should handle Validation errors Such as the repeated emails or userId or missing fields', async()=>{
        const user_data = { email : "andyadeleye@gmail.com", phone : "08102980007"}//missing some required fields e.g firstName, lastName
        try{
            await registerwitherror(user_data)
        }
        catch(error){
            expect(error).toEqual(failedmockregistertiondetails)
        }
    })
})

describe('Login Endpoint', ()=>{
    it('it should successfully login a user',async()=> {
        const user_data = {email : "andyadeleye@gmail.com", password : "leye123"}
        const loggedinuser = await login(user_data)
        expect(loggedinuser).toEqual(mocklogindetails)
    })
    it('it shouold return an unauthorized error', async()=> {
        const user_data = {email : "andyadeleye@gmail.com", password : "wrongpassword"}
        try{
            await loginwithwrongpassword(user_data)
        }
        catch(error){
            expect(error).toEqual(failedpassworddetails)
        }
    })
    it('it should return a Validation error', async()=>{
        const user_data = {email : "andyadeleye@gmail.com"}
        try{
            await loginwithmissingrequiredfield(user_data) 

        }
        catch(error){
            except(error).toEqual(failedmocklogindetails)
        }
    })
})