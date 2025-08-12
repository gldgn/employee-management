import { expect } from '@open-wc/testing';
import { store } from '../src/store.js';

describe('store logic', () => {
  beforeEach(() => { localStorage.clear(); store.saveAll([]); });

  it('add / getById / update / remove', () => {
    const id = store.add({
      firstName:'Ali', lastName:'Kara', doe:'2023-01-01', dob:'1990-01-01',
      phone:'+90 555 000 11 22', email:'ali.kara@example.com', department:'Tech', position:'Junior'
    });
    const found = store.getById(id);
    expect(found.email).to.equal('ali.kara@example.com');

    store.update(id, { position: 'Senior' });
    expect(store.getById(id).position).to.equal('Senior');

    store.remove(id);
    expect(store.getById(id)).to.equal(undefined);
  });

  it('existsByNameEmail detects duplicates (excludes current id)', () => {
    const id1 = store.add({
      firstName:'A', lastName:'B', doe:'2023-01-01', dob:'1990-01-01',
      phone:'+90', email:'dup@example.com', department:'Tech', position:'Junior'
    });
    // duplicate exists
    expect(store.existsByNameEmail('A','B','dup@example.com')).to.equal(true);
    // excluding itself returns false
    expect(store.existsByNameEmail('A','B','dup@example.com', id1)).to.equal(false);
  });
});
