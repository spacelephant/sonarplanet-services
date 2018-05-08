/// <reference types="jest" />

import * as Myapp from '../src/app'
var request = require('supertest')

const TrackerUtils = require('../src/trackerUtils')
TrackerUtils.watchWebPush = jest.fn()

const InMemoryDB = require('../src/database/InMemoryDataBase')
let database = new InMemoryDB()

// Account
let account_1 = {
  ubid: '1234'
}

// Web Push Notification
let wpn_201 = {
  subscription: {
    endpoint: 'endpoint',
    keys: {
      p256dh: '256',
      auth: 'auth'
    }
  }
}

let wpn_400 = {
  subscription: {
    endpoint: 'endpoint'
  }
}

// Public Address Subscription
let publicAddressSubscription_201 = {
  publicAddress: '0xh5Test'
}

describe('Sonar Planet API', () => {
  beforeAll(() => {
    boostrapDataBaseForTest()
  })

  afterAll(() => {
    database.db.dropDatabase(() => {})
  })

  describe('Account', () => {
    it('Account 123 not found', done => {
      request(Myapp)
        .get('/api/v1/accounts/123')
        .expect(404, {}, done)
    })

    it('Account 123456789 found', done => {
      request(Myapp)
        .get('/api/v1/accounts/123456789')
        .expect(200, { uniqueId: '123456789', _id: '2' }, done)
    })

    it('Create account 1234 OK 201', done => {
      request(Myapp)
        .post('/api/v1/accounts')
        .send(account_1)
        .expect(201, { uniqueId: '1234', _id: '3' }, done)
    })

    it('Create account 1234 BAD REQUEST 400', done => {
      request(Myapp)
        .post('/api/v1/accounts')
        .send({})
        .expect(400, {}, done)
    })

    it('Create account 1234 DUPLICATE_KEY 500', done => {
      request(Myapp)
        .post('/api/v1/accounts')
        .send(account_1)
        .expect(500, { message: 'duplicate key error index' }, done)
    })
  })

  describe('WebPush notification settings', () => {
    it('Create webPushNotification for not found account', done => {
      request(Myapp)
        .post('/api/v1/accounts/123/webpush-notifications')
        .send(wpn_201)
        .expect(404, {}, done)
    })

    it('Create webPushNotification BAD REQUEST 400', done => {
      request(Myapp)
        .post('/api/v1/accounts/123456789/webpush-notifications')
        .send(wpn_400)
        .expect(400, {}, done)
    })

    it('Create webPushNotification OK 201', done => {
      request(Myapp)
        .post('/api/v1/accounts/123456789/webpush-notifications')
        .send(wpn_201)
        .expect(201, { endpoint: 'endpoint', p256dh: '256', auth: 'auth', _id: 2 }, done)
    })
  })

  describe('Public Address Subscription', () => {
    it('Account not found', done => {
      request(Myapp)
      .post('/api/v1/accounts/123/networks/ETHEREUM_KOVAN/public-address-subscriptions')
      .send(publicAddressSubscription_201)
      .expect(404, {}, done)
    })

    it('No public address parameter BAD REQUEST 400', done => {
      request(Myapp)
      .post('/api/v1/accounts/123456789/networks/ETHEREUM_KOVAN/public-address-subscriptions')
      .send({})
      .expect(400, {}, done)
    })

    it('Public Address Subscription created 201', done => {
      request(Myapp)
      .post('/api/v1/accounts/123456789/networks/ETHEREUM_KOVAN/public-address-subscriptions')
      .send(publicAddressSubscription_201)
      .expect(201, {publicAddress: '0xh5Test', network: 'ETHEREUM_KOVAN', _id: 2})

      database.accountCollection.findOne(
        {
          $and: [
            {uniqueId: '123456789'},
            {publicAddressSubscriptions: {_id:2}}
          ]
        }, (err: Error, account: any) => {
          expect(account._id.toString()).toEqual("2")
          done()
        })
    })

  })

})


let boostrapDataBaseForTest = () => {
  let account = {
    uniqueId: "123456789"
  }

  // New Account
  database.accountCollection.insert(account, (err: Error, acc: any) => {
    if (err) {
      logError(err.toString())
    }
  })

  let logError = (message: string) => {
    console.error('Error during database boostrap. ' + message)
  }
}





