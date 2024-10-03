import { Generated, Insertable, Selectable, Updateable } from "kysely"


export type TrackingTable = {    
    id: Generated<number>
    cardId: string
    ipAddress: string
    created: Generated<Date>
}

export type Tracking = Selectable<TrackingTable>
export type NewTracking = Insertable<TrackingTable>
export type TrackingUpdate = Updateable<TrackingTable>

export type MediaTrackingTable = {
    id: Generated<number>
    cardId: string
    ipAddress: string
    occurences: Generated<number>
    firstOccurence: Generated<Date>
    lastOccurence: Generated<Date>
}

export type MediaTracking = Selectable<MediaTrackingTable>
export type NewMediaTracking = Insertable<MediaTrackingTable>
export type MediaTrackingUpdate = Updateable<MediaTrackingTable>