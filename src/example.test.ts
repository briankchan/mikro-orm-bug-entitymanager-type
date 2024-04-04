import { Entity, MikroORM, PrimaryKey, Property, EntityManager } from '@mikro-orm/sqlite';

@Entity()
class User {

  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

}

class MyEntityManager extends EntityManager {
  foo() {
    return 'bar';
  }
}

let orm: Awaited<ReturnType<typeof createOrm>>;

function createOrm() {
  return MikroORM.init({
    dbName: ':memory:',
    entities: [User],
    entityManager: MyEntityManager,
  })
}

beforeAll(async () => {
  orm = await createOrm();
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.close(true);
});

test('no fork', async () => {
  expect(orm.em.foo()).toBe('bar');
});
test('fork', async () => {
  // typescript error:
  // Property 'foo' does not exist on type 'SqlEntityManager<AbstractSqlDriver<AbstractSqlConnection, AbstractSqlPlatform>>'.
  expect(orm.em.fork().foo()).toBe('bar');
  // but the code executes correctly
});
