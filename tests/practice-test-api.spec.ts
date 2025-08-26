import {test, expect} from '@playwright/test'

test('get all ids', async({request}) => { 
    const response = await request.get('https://restful-booker.herokuapp.com/booking')
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
    console.log(await response.json())

    const responseBody = await response.json() 
    expect(Array.isArray(responseBody)).toBeTruthy() 
    expect(responseBody.length).toBeGreaterThan(0) 

})

test('get by specific id', async({request}) => { 
    let bookingId = '198'
    const response = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`)

    console.log(await response.json())
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const responseBody = await response.json()  
    expect(Object.keys(responseBody)).toBeTruthy()
    expect(Object.values(responseBody)).toBeTruthy()
    expect(Object.keys(responseBody).length).toBeGreaterThan(0)
    expect(responseBody).toHaveProperty('firstname')
    expect(responseBody).toHaveProperty('lastname')
})


test('create new booking', async({request}) => { 
    const response = await request.post('https://restful-booker.herokuapp.com/booking', { 
        headers: {
            'Content-Type': 'application/json'
        }, 

        data: { 
            "firstname": "Huy",
            "lastname": "Tran",
            "totalprice": 121,
            "depositpaid": true,
            "bookingdates": {
            "checkin": "2018-01-01",
            "checkout": "2019-01-01"
            },
            "additionalneeds": "Dinner"
        }
    })
    console.log(await response.json())

    expect(response.ok()).toBeTruthy() 
    expect(response.status()).toBe(200)

    const responseBody = await response.json() 
    expect(Object.keys(responseBody)).toBeTruthy() 
    expect(Object.values(responseBody)).toBeTruthy() 
   expect(Object.keys(responseBody.booking)).toEqual(expect.arrayContaining(['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates']));
})


test('update booking', async({request}) => { 
    let token = ''
    const responseAuth = await request.post('https://restful-booker.herokuapp.com/auth', { 
        headers: { 
            'Content-Type': 'application/json'
        } , 

        data: { 
            "username" : "admin",
            "password" : "password123"
        }
    })  

    expect(responseAuth.ok()).toBeTruthy() 
    expect(responseAuth.status()).toBe(200)
    
    const responseAuthBody = await responseAuth.json() 
    expect(Object.keys(responseAuthBody)).toBeTruthy()
    expect(Object.keys(responseAuthBody).length).toBeTruthy()
    // expect(Object.keys(responseAuthBody)).toHaveProperty('token')
    token = await responseAuthBody.token

    let bookingId = '198'
    const response = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`, { 
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': `token=${token}`
        }, 

        data: { 
            "firstname": "Huy updated",
            "lastname": "Tran updated",
            "totalprice": 1212,
            "depositpaid": false,
            "bookingdates": {
            "checkin": "2018-01-01",
            "checkout": "2019-01-01"
            },
            "additionalneeds": "breakfast"
        }
    })

    console.log(await response.json())

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200) 

    const responseBody = await response.json()
    expect(Object.keys(responseBody)).toBeTruthy()
    // expect(Object.keys(responseBody).length).toBeGreaterThan(0)
    expect(Object.keys(responseBody)).toContain('firstname');
    expect(Object.keys(responseBody)).toContain('lastname')
    expect(Object.keys(responseBody)).toContain('totalprice')
    expect(Object.keys(responseBody)).toContain('depositpaid')
    
})