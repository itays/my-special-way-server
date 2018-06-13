import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthServiceInterface } from '../auth-service/auth.service.interface';

describe('auth controller', () => {
    let authController: AuthController;
    let authServiceMock: AuthServiceInterface;
    let responseMock;
    beforeEach(() => {
        authServiceMock = {
            createTokenFromCridentials: jest.fn(),
            validateUserByCridentials: jest.fn(),
        };

        responseMock = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        authController = new AuthController(authServiceMock);
    });

    it('should return 500 server error if error happened', async () => {
        const createTokenFn = authServiceMock.createTokenFromCridentials as jest.Mock<Promise<[Error, string]>>;
        createTokenFn.mockReturnValueOnce([new Error('mock error'), null]);

        await authController.login(responseMock, null);

        expect(responseMock.status).toHaveBeenCalledWith(500);
        expect(responseMock.json).toHaveBeenCalledWith({
            error: 'server error',
            message: 'unknown server error',
        });
    });

    it('should return 401 if user token returned null', async () => {
        expect.hasAssertions();

        const createTokenFn = authServiceMock.createTokenFromCridentials as jest.Mock<Promise<[Error, string]>>;
        createTokenFn.mockReturnValueOnce([null, null]);

        await authController.login(responseMock, null);

        expect(responseMock.status).toHaveBeenCalledWith(401);
        expect(responseMock.json).toHaveBeenCalledWith({
            error: 'unauthenticated',
            message: 'username of password are incorrect',
        });
    });

    it('should return response with token if user has been found and password match', async () => {
        expect.hasAssertions();

        const createTokenFn = authServiceMock.createTokenFromCridentials as jest.Mock<Promise<[Error, string]>>;
        createTokenFn.mockReturnValueOnce([null, 'some-very-secret-token']);

        await authController.login(responseMock, null);

        expect(responseMock.json).toHaveBeenCalledWith({
            accessToken: 'some-very-secret-token',
        });
    });
});