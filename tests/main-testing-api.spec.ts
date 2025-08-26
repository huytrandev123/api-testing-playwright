import {test, expect} from '@playwright/test'

let bookingId:number

test.describe('Level 1 - GET requests booking', () => { 
    test.beforeEach(async({request}) => { 
        const response = await request.get('https://restful-booker.herokuapp.com/booking')
        expect(response.ok()).toBeTruthy() 
        expect(response.status()).toBe(200) 

        console.log(await response.json());
        
        const responseBody = await response.json() 
        expect(Array.isArray(responseBody)).toBeTruthy() 
        expect(responseBody.length).toBeGreaterThan(0)

        // random index
        const randomIndex = Math.floor(Math.random() * responseBody.length)
        bookingId = responseBody[randomIndex].bookingid
        console.log('>>> Random index: ',randomIndex)
    })

    // GET/booking/{id} (valid)
    test('Get booking detail existing id', async({request}) => { 
        const response = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`)
        expect(response.ok()).toBeTruthy()
        expect(response.status()).toBe(200)

        console.log(await response.json());
       
        const responseBody = await response.json()
        expect(Object.keys(responseBody)).toBeTruthy()
        expect(Object.values(responseBody)).toBeTruthy()
        expect(Object.keys(responseBody).length).toBeGreaterThan(0)
        expect(Object.keys(responseBody)).toEqual(
        expect.arrayContaining(
            [
                "firstname", 
                "lastname", 
                "totalprice", 
                "depositpaid", 
                "bookingdates"
            ])
        );

    })

    // GET/booking/{id} (invalid)
    test('Get booking details with non-existing ID', async ({ request }) => {
        // const invalidId = 100000; 
        // const response = await request.get(`https://restful-booker.herokuapp.com/booking/${invalidId}`);
        // expect(response.status()).toBe(404);

        const responseIds = await request.get('https://restful-booker.herokuapp.com/booking')
        expect(responseIds.ok()).toBeTruthy() 
        expect(responseIds.status()).toBe(200) 
        const responseBodyIds = await responseIds.json() 
        const validId = Math.max(...responseBodyIds.map(responseBodyId => responseBodyId.bookingid))
        const invalidId = validId + Math.floor(Math.random() * responseBodyIds.length) + 1
        
        const invalidResponse = await request.get(`https://restful-booker.herokuapp.com/booking/${invalidId}`)
        expect(invalidResponse.status()).not.toBe(200)

    });

    // GET/booking?firstname&lastname
    test('search bookings by firstname/lastname', async({request}) => { 
        const response = await request.get('https://restful-booker.herokuapp.com/booking?firstname=John&lastname=Smith')
        expect(response.ok()).toBeTruthy()
        expect(response.status()).toBe(200)
        const responseBody = await response.json()
        console.log('>>> SEARCH FIRSTNAME: ', responseBody)

    })
})


test.describe('Level 2 & 3 - POST, Auth, Update and Delete', () => { 
    // POST & Auth
    let bookingId:number
    test('create a new booking', async({request}) => { 
        const response = await request.post('https://restful-booker.herokuapp.com/booking', {
            headers: { 
                'Content-Type': 'application/json'
            }, 

            data: { 
                "firstname" : "Huy",
                "lastname" : "Tran",
                "totalprice" : 140,
                "depositpaid" : false,
                "bookingdates" : {
                    "checkin" : "2025-01-01",
                    "checkout" : "2025-02-01"
                },
                "additionalneeds" : "Dinner"
            }
        })
        expect(response.ok()).toBeTruthy()
        expect(response.status()).toBe(200)

        const responseBody = await response.json()
        console.log(responseBody);

        expect(Object.keys(responseBody)).toBeTruthy()
        expect(Object.values(responseBody)).toBeTruthy()
        expect(Object.keys(responseBody).length).toBeGreaterThan(0)
        expect(responseBody.booking).toMatchObject({
            firstname: "Huy",
            lastname: "Tran",
            totalprice: 140,
            depositpaid: false,
            bookingdates: {
                checkin: "2025-01-01",
                checkout: "2025-02-01"
            }, 
            additionalneeds : "Dinner"
        });

        bookingId = responseBody.bookingid
        console.log('>>> bookingID POST request', bookingId)
        
    })

    test('create an auth token', async({request}) => { 
        let token:string
        const responseAuth = await request.post('https://restful-booker.herokuapp.com/auth', { 
            headers: { 
                'Content-Type': 'application/json' 
            }, 

            data: { 
                "username" : "admin",
                "password" : "password123"
            }
        })

        expect(responseAuth.ok()).toBeTruthy()
        expect(responseAuth.status()).toBe(200) 

        const responseAuthBody = await responseAuth.json() 
        console.log('>>> responseAuth: ', responseAuthBody)
        expect(Object.keys(responseAuthBody)).toBeTruthy()
        expect(Object.keys(responseAuthBody).length).toBeTruthy() 

        // save token
        token = responseAuthBody
    })

    
})