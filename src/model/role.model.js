import { ObjectId } from "mongodb";
import mongoose from "mongoose";

// -------------------- Schema Setup --------------------
const roleSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},

}, {timestamps: true});

const Role = mongoose.model('Role', roleSchema);

export const rolesEnum = {
    admin: 'admin',
    creator: 'creator',
    user: 'user',
    unverified: 'unverified'
};

// -------------------- Seeding --------------------
export async function seedRoles() {
    // Loesche alle bisherigen Rolleneintraege
    await Role.deleteMany({});

    // Neue Rolle fuer admin
    const adminRole = new Role({
        _id: new ObjectId('6405ac7d6b2564cd76c42603'),
        name: rolesEnum.admin
    });

    // Neue Rolle fuer user
    const creatorRole = new Role({
        _id: new ObjectId('6405ac7d6b2564cd76c42604'),
        name: rolesEnum.creator
    });
    
    // Neue Rolle fuer user
    const userRole = new Role({
        _id: new ObjectId('6405ac7d6b2564cd76c42605'),
        name: rolesEnum.user
    });
 
    // Neue Rolle fuer user
    const unverifiedRole = new Role({
        _id: new ObjectId('6405ac7d6b2564cd76c42606'),
        name: rolesEnum.unverified
    });

    await Promise.all([unverifiedRole.save(), userRole.save(), creatorRole.save(), adminRole.save()]);
}

//?-----BasicFunctions-----

export async function getAll() {
    return await Role.find();
}

export async function findByName(name) {
    const role = await Role.findOne({name: name});
    if (!role) throw new Error(`No such Role found: ${name}`, {cause: 404});
    return role;
}

export async function findById(id) {
    const role = await Role.findOne({_id: id});
    if (!role) throw new Error(`No such Role found: ${id}`, {cause: 404});
    return role;
}