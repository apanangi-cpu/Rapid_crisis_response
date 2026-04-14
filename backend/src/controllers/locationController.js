import { Floor } from '../models/Floor.js';
import { Room } from '../models/Room.js';
import { AppError } from '../middleware/errorHandler.js';

export async function listFloors(req, res, next) {
  try {
    const floors = await Floor.find().sort({ level: 1 }).lean();
    res.json({ success: true, floors });
  } catch (e) {
    next(e);
  }
}

export async function listRooms(req, res, next) {
  try {
    const { floorId } = req.query;
    if (!floorId) throw new AppError('floorId is required', 400);
    const rooms = await Room.find({ floor: floorId }).sort({ code: 1 }).lean();
    res.json({ success: true, rooms });
  } catch (e) {
    next(e);
  }
}

export async function createFloor(req, res, next) {
  try {
    const floor = await Floor.create(req.body);
    res.status(201).json({ success: true, floor });
  } catch (e) {
    next(e);
  }
}

export async function createRoom(req, res, next) {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, room });
  } catch (e) {
    next(e);
  }
}
