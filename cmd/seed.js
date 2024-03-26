const { groupGetByName, groupCreate, groupAddToPermission } = require("../services/groups");
const { permissionGetByName, permissionCreate } = require("../services/permissions");
const { userCreate, userGetByEmail, userAddToGroup } = require("../services/users");


const seedGroupPermission = async (group, permission) => {
    try {
        await groupAddToPermission(group, permission);
    } catch (err) {
        console.log(`Permission ${permission.name} already in group ${group.name}`)
    }
}

const seedUserGroup = async (user, group) => {
    try {
        await userAddToGroup(user, group);
    } catch (err) {
        console.log(`User ${user.email} already in group ${group.name}`)
    }
}

const seedGroup = () => {
    let groups = [
        { "name": "Super Admin", "permissions": [] },
        { "name": "Admin", "permissions": ["users-create", "users-read", "users-update", "users-delete"] },
        {
            "name": "User", "permissions": []
        }
    ]
    groups.map(async (group) => {
        try {
            await groupGetByName(group.name).then(async (groupCreated) => {
                group.permissions.map(async (perm) => {
                    await permissionGetByName(perm).then(async (permission) => {
                        await seedGroupPermission(groupCreated, permission);
                    });
                })
            });
        } catch (err) {
            await groupCreate(group.name).then(async (groupCreated) => {
                group.permissions.map(async (perm) => {
                    await permissionGetByName(perm).then(async (permission) => {
                        await seedGroupPermission(groupCreated, permission);
                    });
                })
            });
        }
    })
}

const seedPermission = () => {
    let permissions = ["users-create", "users-read", "users-update", "users-delete"];
    permissions.map(async (permission) => {
        try {
            await permissionGetByName(permission);
            console.log(`Permission ${permission} already exists`)
        } catch (err) {
            await permissionCreate(permission);
            console.log(`Permission ${permission} created`)
        }
    });
}

const seedUser = () => {
    console.log("Seeding users...");
    let users = [
        {
            "username": "superadmin",
            "email": "superadmin@test.com",
            "password": "test1234",
            "fullname": "Super Admin",
            "group": "Super Admin"
        },
        {
            "username": "admin",
            "email": "admin@test.com",
            "password": "test1234",
            "fullname": "Admin",
            "group": "Admin"
        },
        {
            "username": "user",
            "email": "user@test.com",
            "password": "test1234",
            "fullname": "User",
            "group": "User"
        }
    ]
    users.map(async (user) => {
        try {
            await userGetByEmail(user.email).then(
                async (userFound) => {
                    await groupGetByName(user.group).then(
                        async (group) => {
                            await seedUserGroup(userFound, group);
                        }
                    )
                }
            );
            console.log(`User ${user.email} already exists`)
        } catch (err) {
            await userCreate(user.username, user.email, user.password, user.fullname).then(
                async (userFound) => {
                    await groupGetByName(user.group).then(
                        async (group) => {
                            await seedUserGroup(userFound, group);
                        }
                    )
                }
            );
        }
    })
}

const seedCmd = (seedOption) => {
    subSeed = ['users', 'all'];
    if (!subSeed.includes(seedOption)) {
        console.log("Options for seed: users, all");
        return
    }

    if (seedOption == 'users') {
        seedPermission()
        seedGroup()
        seedUser()
        return
    }

    if (seedOption == 'all') {
        seedPermission()
        seedGroup()
        seedUser()
        return
    }
}

module.exports = { seedCmd }