import { prepareGetChatsQueries, onSnapshot } from '../services/ChatService';
import { AuthContext } from '../context/AuthContext';

describe('getChats', () => {
  const uid = 'test-user-id';
  let onSnapshotSpy;
  let queries;

  beforeEach(() => {
    onSnapshotSpy = spyOn(onSnapshot, 'bind').and.callFake((query) => {
      return {
        onSnapshot: (callback) => {
          callback({
            docs: [{
              id: 'test-chat-id',
              data: () => ({ name: 'Test chat' })
            }]
          });
        }
      };
    });

    queries = prepareGetChatsQueries(uid);
  });

  it('should call onSnapshot twice with proper queries', () => {
    const authContext = { currentUser: { uid } };
    const getChats = Home.prototype.getChats.bind({
      authContext,
      setJoinedChats: () => {},
      setOthersChats: () => {}
    });

    getChats();

    expect(onSnapshotSpy).toHaveBeenCalledTimes(2);
    expect(onSnapshotSpy).toHaveBeenCalledWith(queries.getJoined);
    expect(onSnapshotSpy).toHaveBeenCalledWith(queries.getOthers);
  });

  it('should call setJoinedChats with proper data', () => {
    const setJoinedChats = jasmine.createSpy('setJoinedChats');
    const authContext = { currentUser: { uid } };
    const getChats = Home.prototype.getChats.bind({
      authContext,
      setJoinedChats,
      setOthersChats: () => {}
    });

    getChats();

    expect(setJoinedChats).toHaveBeenCalledWith([{
      id: 'test-chat-id',
      data: { name: 'Test chat' }
    }]);
  });

  it('should call setOthersChats with proper data', () => {
    const setOthersChats = jasmine.createSpy('setOthersChats');
    const authContext = { currentUser: { uid } };
    const getChats = Home.prototype.getChats.bind({
      authContext,
      setJoinedChats: () => {},
      setOthersChats
    });

    getChats();

    expect(setOthersChats).toHaveBeenCalledWith([{
      id: 'test-chat-id',
      data: { name: 'Test chat' }
    }]);
  });
});