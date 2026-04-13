const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

exports.signup = async(data) => {
    const hash = await bcrypt.hash(data.password, 10);
    const user = await db.query(
        `INSERT INTO users(name,email,password,role)
        VALUES($1,$2,$3,$4) RETURNING id,email`,
        [data.name,data.email,hash,data.role]
    );

    return user.rows[0];
}

exports.login = async(data)=>{
    const user = await db.query(
        "SELECT * FROM users WHERE email=$1",
        [data.email]
    );

    const valid = await bcrypt.compare(
        data.password,
        user.rows[0].password
    );

    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign(
        {id: user.rows[0].id},
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return token;
}