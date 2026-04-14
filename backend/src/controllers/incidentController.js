import {
  createIncident,
  listIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident
} from '../services/incidentService.js'

export async function create(req, res, next) {
  try {
    const {
      emergencyType,
      floorId,
      roomId,
      floor,
      room,
      title,
      description,
      sosSource
    } = req.body

    const doc = await createIncident({
      emergencyType,

      floorId: floorId || null,
      roomId: roomId || null,

      floor: floor || '',
      room: room || '',

      title,
      description,
      triggeredByUserId: req.user._id,
      sosSource: sosSource || 'sos_panel',
    })

    res.status(201).json({
      success: true,
      incident: doc
    })
  } catch (e) {
    next(e)
  }
}

export async function listAll(req, res, next) {
  try {
    const { type, status, sort, limit, skip } = req.query

    const { items, total } = await listIncidents({
      type,
      status,
      sort,
      limit,
      skip
    })

    res.json({
      success: true,
      incidents: items,
      total
    })
  } catch (e) {
    next(e)
  }
}

export async function getById(req, res, next) {
  try {
    const doc = await getIncidentById(req.params.id)

    res.json({
      success: true,
      incident: doc
    })
  } catch (e) {
    next(e)
  }
}

export async function update(req, res, next) {
  try {
    const { incidentId, status, assignedTo, note } = req.body

    const doc = await updateIncident(incidentId, {
      status,
      assignedTo,
      noteText: note,
      actorUserId: req.user._id,
      actorRole: req.user.role,
    })

    res.json({
      success: true,
      incident: doc
    })
  } catch (e) {
    next(e)
  }
}

export async function remove(req, res, next) {
  try {
    await deleteIncident(req.params.id, req.user._id)

    res.json({
      success: true
    })
  } catch (e) {
    next(e)
  }
}