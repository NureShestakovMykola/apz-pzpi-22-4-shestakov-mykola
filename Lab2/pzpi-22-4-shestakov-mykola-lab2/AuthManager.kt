package com.growmate.android.growmateandroid

import android.content.Context
import androidx.core.content.edit

object AuthManager {
    fun getToken(context: Context): String? =
        context.getSharedPreferences("auth", Context.MODE_PRIVATE).getString("token", null)

    fun setToken(context: Context, token: String) {
        context.getSharedPreferences("auth", Context.MODE_PRIVATE).edit() {
            putString(
                "token",
                token
            )
        }
    }

    fun clear(context: Context) {
        context.getSharedPreferences("auth", Context.MODE_PRIVATE).edit() { clear() }
    }
}