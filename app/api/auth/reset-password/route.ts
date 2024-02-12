import { connectToMongoDB } from "@/app/lib/mongodb"
import ForgotPasswordToken from "@/app/models/ForgotPasswordToken"
import User from "@/app/models/User";
import mongoose, { startSession } from "mongoose";
import { NextResponse } from "next/server"

export async function POST(req: Request) {

    let session;

    try {
        const { password, resetToken } = await req.json()
        connectToMongoDB().catch(err => NextResponse.json(err))

        const passResetToken = await ForgotPasswordToken.findOne({
            token: resetToken,
            resetAt: null,
            createdAt: { $gt: new Date(Date.now() - 1000 * 60 * 60 * 2) }
        })

        if (!passResetToken) {
            return NextResponse.json({ success: false, error: "Either this link is expired or it's invalid" }, { status: 401 })
        }

        // update resetAt
        // update password

        session = await startSession()
        session.startTransaction()

        passResetToken.resetAt = new Date()
        await passResetToken.save({ session })

        const user = await User.findById(passResetToken.userId)
        user.password = password
        await user.save({ session })

        await session.commitTransaction()
        session.endSession()

        return NextResponse.json({
            success: true,
            msg: "Password Updated successfully"
        })
    } catch (error) {
        session?.abortTransaction()

        if (error instanceof mongoose.Error.ValidationError) {
            for (let field in error.errors) {
                const msg = error.errors[field].message
                return NextResponse.json({ success: false, error: msg }, { status: 403 })
            }
        }

        return NextResponse.json({ success: false, error }, { status: 520 })
    }
}