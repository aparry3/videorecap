import { sql } from "kysely";
import { MediaTracking, NewMediaTracking, NewTracking, Tracking } from "../@types/Tracking";
import { db } from "./db";


export const upsertMediaTracking = async (tracking: NewMediaTracking): Promise<MediaTracking> => {
    const updatedTracking = await db
        .insertInto('mediaTracking')
        .values(tracking)
        .onConflict((oc) => oc
            .columns(['cardId', 'ipAddress'])
            .doUpdateSet({
                ...tracking,
                occurences: sql`media_tracking.occurences + 1`,
                lastOccurence: sql`now()`
            })
        )
        .returningAll()
        .executeTakeFirst()
    return updatedTracking as MediaTracking
}

export const insertTracking = async (tracking: NewTracking): Promise<Tracking> => {
    const newTracking = await db.insertInto('tracking').values(
        tracking
    ).returningAll().executeTakeFirst();

    return newTracking as Tracking
}