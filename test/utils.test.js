const _ = require("lodash");
const PasswordHelper = require("../shared/password");
const jwt = require("../shared/jwt");
const expect = require("chai").expect;

describe('Password Utilities',function () {

    it('should hash password with salt',function () {

        const plainPassword = 'test-password';
        const salt = PasswordHelper.generateSalt();
        const hashed = PasswordHelper.hashPassword(plainPassword,salt);
        expect(salt.length).to.be.greaterThan(0);
        expect(hashed.length).to.be.greaterThan(0);
    });

    it('should compare password matches hash',function () {

        const plainPassword = 'test-password';
        const salt = PasswordHelper.generateSalt();
        const hashed = PasswordHelper.hashPassword(plainPassword,salt);
        expect(PasswordHelper.areEqual(hashed,salt, plainPassword) ).to.be.true;
    });

    it('should fail compare password different passwords',function () {

        const plainPassword = 'test-password';
        const salt = PasswordHelper.generateSalt();
        const hashed = PasswordHelper.hashPassword(plainPassword,salt);
        expect(PasswordHelper.areEqual(hashed,salt, "fake-password") ).to.be.false;
    });

});


describe('JWT Utilities',function () {

    it('should sign jwt token',function () {

        const user = { id: 1 };
        const token = jwt.signJwt(user,{ key: 'd49ZXAXkdPMSAEYn' , issuer: '*.creatopy' });
        expect(token).to.exist;
        console.log(token);
    });

    it('should verify jwt token successfully',function () {

        const options = { key: 'd49ZXAXkdPMSAEYn' , issuer: '*.creatopy' };
        const user = { id: 1 };
        const token = jwt.signJwt(user,options);
        expect(token).to.exist;

        //  verify token
        const payload = jwt.verifyJwt(token,options);
        expect(payload.id).to.equal(user.id);
    });

    it('should fail to verify invalid token',function () {

        const options = { key: 'd49ZXAXkdPMSAEYn' , issuer: '*.creatopy' };
        const payload = jwt.verifyJwt("Bcsa33245=342535630635#",options);
        expect(payload).to.equal(undefined);
    });
});
