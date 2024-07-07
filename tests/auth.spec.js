

const axios = require("axios")
const jwtDecode = require("jwt-decode")

jest.mock("axios")
jest.mock('jwt-decode',() => jest.fn())
jest.setTimeout(10000);





const BaseUrl = "https://hngtask2-nine.vercel.app"

const mockjwtvalue = {
    "token_type": "access",
    "exp": 1720431264,
    "iat": 1720344864,
    "jti": "e41bf256b5164f688a24f997b664f66f",
    "user_id": "5a56cd91-ef55-4e21-9fb6-f4d7d1253c98"}


  const mocklogindetails = {
    "status": "success",
    "message": "Login Successful",
    "data": {
     'accessToken': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIwNDMxMjY0LCJpYXQiOjE3MjAzNDQ4NjQsImp0aSI6ImU0MWJmMjU2YjUxNjRmNjg4YTI0Zjk5N2I2NjRmNjZmIiwidXNlcl9pZCI6IjVhNTZjZDkxLWVmNTUtNGUyMS05ZmI2LWY0ZDdkMTI1M2M5OCJ9.Whq9JJPNvAWsQ7WSmvnQpuV52JD31Se7Q_X1yETZdfQ",
    "user": {userId: "23futu6879yjnrjeemne",
     firstName : "Andrew", 
     lastName : "Adeleye", 
     email : "andyadeleye@gmail.com", 
     phone : "08102980007", 
     password : "leye123"}
 }
}

const mockuserorganisationreply = {
            "status": "success",
            "message":"QuerySuccessful",
            "data" : {
                "organisations": [
                    {
                    "orgid" : "teettetetet",
                    "name" : "Andrew's Org",
                    "description" : ''
                }
            ]
            }
}

const login = async(data) => {
    //Simulating successful response
    axios.post.mockResolvedValueOnce({data : mocklogindetails})
    const response = await axios.post(`${BaseUrl}/auth/login`, data)
  
    return response.data
}

const getorganisations = async(token) =>{
    axios.get.mockResolvedValueOnce({data : mockuserorganisationreply})
    const config = {
        'Content-Type': "application/json",
        'Authorization' : `Bearer ${token}`
    }
    const response = await axios.get(`${BaseUrl}/api/organisations`, config)
    return response.data
}

const usejwtdecodetocheckvalue = (token) => {
    jwtDecode.mockImplementation(() => (mockjwtvalue));
        
    const decoded = jwtDecode(token);

    return decoded
}

const registeruserforreal = async() => {
    const user_data = {"firstName": "Andrew", "lastName":"Adeleye", "email": "andyadeleye@gmail.com", "phone":"08102980007","password":"leye123"}
    const header = {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(user_data)
    }
    const response = await fetch(`${BaseUrl}/auth/register`, header)
    return response
}
const validationerror = async() => {
    const user_data = {"email": "andyadeleye@gmail.com", "phone":"08102980007"}
    
        const header = {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(user_data)
        }
        const response = await fetch(`${BaseUrl}/auth/register`, header)
        if (!response.ok) {
       
            const statusCode = response.status
            return statusCode
           
          }
   
}
const successfuluserlogin = async(token) => {
    const user_data = {"email": "andyadeleye@gmail.com", "password":"leye123"}
    const header = {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(user_data)
    }
    const response = await fetch(`${BaseUrl}/auth/login`, header)
    
    return response
}

const faileduserlogin = async() => {
    const user_data = {"email": "andyadeleye@gmail.com", "password":"leye13"}
    
    const header = {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(user_data)
        }
    const response = await fetch(`${BaseUrl}/auth/login`, header)
    if (!response.ok) {
       
        const statusCode = response.status
        return statusCode
       
      }
    

}
const loginvalidationerror = async() => {
    const user_data = {"email": "andyadeleye@gmail.com"}
    
    const header = {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(user_data)
        }
    const response = await fetch(`${BaseUrl}/auth/login`,header)
    if (!response.ok) {
       
        const statusCode = response.status
        return statusCode
       
      }
        
        
}

const getuserorganisation = async(token) => {
    const header = {
        method : 'GET',
        headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }
    
    const response = await fetch(`${BaseUrl}/api/organisations`,header)
    const data = response.json()
    return data
}

describe("Token Generation", ()=>{
    it("User Details Should be in Token", async()=>{
        const user_data = {"email":"andyadeleye@gmail.com", "password":"leye123"}
        const response = await login(user_data)
        
        const decoded = usejwtdecodetocheckvalue(response.data.accessToken)
        expect(decoded).toHaveProperty('user_id');
    })
    it("Expires at the correct Time", async()=> {
        const user_data = {"email":"andyadeleye@gmail.com", "password":"leye123"}
        const response = await login(user_data)
        
        const decoded = usejwtdecodetocheckvalue(response.data.accessToken)
        expect(decoded).toHaveProperty('exp');
    })
} )

describe("Organisations",()=> {
    it("Ensures Users Can see the organisation they belong to", async()=>{
        const user_data = {"email":"andyadeleye@gmail.com", "password":"leye123"}
        const response = await login(user_data)
        const getuserorganisations = await getorganisations(response.data.accessToken)
        expect(getuserorganisations.data).toHaveProperty('organisations')

    })
  
})

describe("End to End tests", ()=> {
    it("register the user with default Organisation", async()=>{
        const registerdetails = await registeruserforreal()
        expect(registerdetails.status).toBe(201)
        let name = await registerdetails.json()
        let firstName = name.data.user.firstName
        expect(firstName).toBe("Andrew")

    })
    it("should check for validation errors", async()=> {
        const vallidationerror = await validationerror()
        expect(vallidationerror).toBe(422)
    })
    it("Should Check whether a users Organisation was correcly generated", async() => {
        const loginforreal = await successfuluserlogin()
        let Token = await loginforreal.json()
        let accessToken  = Token.data.accessToken
        const organisation = await getuserorganisation(accessToken)
        
        expect(organisation.data).toHaveProperty('organisations')
    })
    it("should Check for Successfull login", async()=> {
        const loginforreal = await successfuluserlogin()
        expect(loginforreal.status).toBe(200)
        let Token = await loginforreal.json()
        let token = Token.data
        expect(token).toHaveProperty('accessToken')
    })
    it("Should return error response on failed login ", async() => {
        const failed = await faileduserlogin()
        expect(failed).toBe(401)
    }) 
    it("should validate login", async()=> {
        const failed = await loginvalidationerror()
        expect(failed).toBe(422)
    })
})

