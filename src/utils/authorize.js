import { findById } from "../model/role.model.js"

export async function validateAdmin(user){
    let role = await findById(user.role.toString())
    return (role.name === 'admin')
}

export async function validateCreator(user){
    let role = await findById(user.role.toString())
    return (role.name === 'creator')
}

export async function validateCreatorOrAdmin(user){
    let role = await findById(user.role.toString())
    return (role.name === 'creator' || role.name === 'admin')
}

