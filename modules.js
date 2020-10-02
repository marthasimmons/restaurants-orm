const db = require('./db')

class Restaurant{

    constructor(data) {
        if (!data.name) throw new Error("Restaurants must have a name")

        const restaurant = this

        restaurant.name = data.name
        restaurant.description = data.description
        restaurant.image = data.image
        restaurant.id = data.id
        
        restaurant.menus = []
        restaurant.tables = []

        if (restaurant.id) {
            return new Promise((resolve, reject) => {
                db.all('SELECT * FROM menus WHERE restaurant_id=?;', restaurant.id, async function (err,rows) {
                    const menus = rows.map(row => new Menu(row))

                    Promise.all(menus).then((menus) => {
                        menus.forEach(menu => {
                            restaurant.menus.push(menu)
                        });

                        db.all('SELECT * FROM tables WHERE restaurant_id=?;', restaurant.id, async function (err,rows) {
                            const tables = rows.map(row => new Table(row))


                            Promise.all(tables).then((tables) => {
                                tables.forEach(table => {
                                    restaurant.tables.push(table)
                                });

                                resolve(restaurant)
                             
                            })
                        })
                        
                    })

                })

            })
        }
        else {
            return new Promise((resolve,reject) => {
                db.run('INSERT INTO restaurants (name,description,image) VALUES (?,?,?);', [restaurant.name, restaurant.description, restaurant.image], function (err) {
                    if (err) return reject(err)
                    restaurant.id = this.lastID
                    return resolve (restaurant)
                })
            })

        }

    }

    async addMenu(data) {
        const menu = await new Menu({name: data.name, restaurant_id: this.id})
        this.menus.push(menu)
    }

    async addTable(data) {
        const table = await new Table({restaurant_id: this.id})
        this.tables.push(table)
    }

}

class Menu{
    constructor(data){
        if (!data.name) throw new Error("Menus must have a name")
        if (!data.restaurant_id) throw new Error("Menus must belong to a restaurant")

        const menu = this

        menu.name = data.name
        menu.restaurant_id = data.restaurant_id
        menu.id = data.id 

        menu.items = []

        if (menu.id) {
            return new Promise ((resolve,rejesct) => {
                db.all('SELECT * FROM items WHERE menu_id=?;', menu.id, async function (err,rows) {
                    const items = rows.map(row => new Item(row))

                    Promise.all(items).then((items) => {
                        items.forEach(item => {
                            menu.items.push(item)
                        });
                        resolve(menu)
                    })

                })
            })
        }
        else {
            return new Promise((resolve,reject) => {
                db.run('INSERT INTO menus (name,restaurant_id) VALUES(?,?);', [menu.name, menu.restaurant_id], function (err) {
                    if (err) reject(err)
                    menu.id = this.lastID
                    return resolve(menu)
                })
            })
        }
    }

    async addItem(data) {
        const item = await new Item({name: data.name, price: data.price, menu_id: this.id})
        this.items.push(item)
    }
}

class Item{
    constructor(data){
        if (!data.name) throw new Error("Items must have a name")
        if (!data.menu_id) throw new Error("Items must belong to a menu")

        const item = this

        item.name = data.name
        item.price = data.price
        item.menu_id = data.menu_id
        item.id = data.id

        if (item.id) {
            return Promise.resolve(item)

        }
        else {
            return new Promise((resolve,reject) => {
                db.run('INSERT INTO items (name, price, menu_id) VALUES(?,?,?);', [item.name,item.price,item.menu_id], function (err) {
                    if (err) reject(err)
                    item.id = this.lastID
                    return resolve(item)
                })
            })
        }

    }
}

class Table {

    constructor(data) {
        if (!data.restaurant_id) throw new Error("Tables must belong to a restaurant")

        const table = this 

        table.restaurant_id = data.restaurant_id
        table.id = data.id

        table.bookings = []

        if (table.id) {
            return new Promise ((resolve,rejesct) => {
                db.all('SELECT * FROM bookings WHERE table_id=?;', table.id, async function (err,rows) {
                    const bookings = rows.map(row => new Booking(row))

                    Promise.all(bookings).then((bookings) => {
                        bookings.forEach(booking => {
                            table.bookings.push(booking)
                        });
                        resolve(table)
                    })

                })
            })

        }
        else {
            return new Promise((resolve,reject) => {
                db.run('INSERT INTO tables (restaurant_id) VALUES(?);', table.restaurant_id, function (err) {
                    if (err) reject(err)
                    table.id = this.lastID
                    return resolve(table)
                })
            })
        }

    }

    async addBooking(data) {
        const booking = await new Booking({name: data.name, date: data.date, time: data.time, table_id: this.id})
        this.bookings.push(booking)
    }
}

class Booking {

    constructor(data) {
        if (!data.name) throw new Error("Bookings must have a name")
        if (!data.table_id) throw new Error("Bookings must belong to a table")

        const booking = this 

        booking.name = data.name
        booking.date = data.date
        booking.time = data.time
        booking.table_id = data.table_id
        booking.id = data.id

        if (booking.id) {
            return Promise.resolve(booking)
        }
        else {
            return new Promise((resolve,reject) => {
                db.run('INSERT INTO bookings (name, date, time, table_id) VALUES(?,?,?,?);', [booking.name, booking.date, booking.time, booking.table_id], function (err) {
                    if (err) reject(err)
                    booking.id = this.lastID
                    return resolve(booking)
                })
            })
        }
    }

}

module.exports = {
    Restaurant,
    Menu,
    Item,
    Table,
    Booking
}