jest.mock('firebase-admin');
import { FCMSender } from './FCMSender';
import * as mockAdmin from 'firebase-admin';

describe('FCMSender', () => {
  let instance: FCMSender;
  let bResult: boolean;
  let sendSuccessMock;
  let sendFailureMock;
  beforeEach(() => {
    instance = new FCMSender();
    sendSuccessMock = {
      send: jest.fn(async () => true),
    };
    sendFailureMock = {
      send: jest.fn(async () => {throw new Error('failed to send message'); }),
    };
  });
  it('should return true when text message sent successfully', async () => {
    // given
    const messagingMock = jest.fn<mockAdmin.messaging.Messaging>(() => (sendSuccessMock));
    Object.defineProperty(mockAdmin, 'messaging', {value: messagingMock, configurable: true});
    // when
    expect(mockAdmin.initializeApp).toHaveBeenCalled();
    bResult = await instance.sendTxtMsgToAndroid('sToken', 'sBody', 'sSbj');
    // then
    expect(sendSuccessMock.send).toHaveBeenCalled();
    expect(bResult).toBe(true);
  });

  it('should return false when text message failed to be sent', async () => {
    // given
    const messagingMock = jest.fn<mockAdmin.messaging.Messaging>(() => (sendFailureMock));
    Object.defineProperty(mockAdmin, 'messaging', {value: messagingMock, configurable: true});
    // when
    bResult = await instance.sendTxtMsgToAndroid('sToken', 'sBody', 'sSbj');
    // then
    expect(sendFailureMock.send).toHaveBeenCalled();
    expect(bResult).toBe(false);
  });

  it('should return true when data message sent successfully', async () => {
    // given
    const messagingMock = jest.fn<mockAdmin.messaging.Messaging>(() => (sendSuccessMock));
    Object.defineProperty(mockAdmin, 'messaging', {value: messagingMock, configurable: true});
    // when
    expect(mockAdmin.initializeApp).toHaveBeenCalled();
    bResult = await instance.sendDataMsgToAndroid('sToken', {});
    // then
    expect(sendSuccessMock.send).toHaveBeenCalled();
    expect(bResult).toBe(true);
  });

  it('should return false when data message failed to be sent', async () => {
    // given
    const messagingMock = jest.fn<mockAdmin.messaging.Messaging>(() => (sendFailureMock));
    Object.defineProperty(mockAdmin, 'messaging', {value: messagingMock, configurable: true});
    // when
    bResult = await instance.sendDataMsgToAndroid('sToken', {});
    // then
    expect(sendFailureMock.send).toHaveBeenCalled();
    expect(bResult).toBe(false);
  });
});
