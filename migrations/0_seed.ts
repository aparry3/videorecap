import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('recipient')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('address_line_one', 'varchar', (col) => col.notNull())
    .addColumn('address_line_two', 'varchar')
    .addColumn('city', 'varchar', (col) => col.notNull())
    .addColumn('state', 'varchar', (col) => col.notNull())
    .addColumn('country', 'varchar', (col) => col.notNull())
    .addColumn('zipcode', 'varchar', (col) => col.notNull())
    .execute()


  await db.schema
    .createTable('card')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('email', 'varchar', (col) => col.notNull())
    .addColumn('message', 'varchar')
    .addColumn('image_url', 'varchar', (col) => col.notNull())
    .addColumn('qr_code_url', 'varchar', (col) => col.notNull())
    .addColumn('video_url', 'varchar')

    .addColumn('recipient_id', 'integer', (col) => col.references('recipient.id'))
    .addColumn('return_recipient_id', 'integer', (col) => col.references('recipient.id'))

    .addColumn('modified', 'varchar', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )

    .execute()

}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('card').execute()
  await db.schema.dropTable('recipient').execute()
}

