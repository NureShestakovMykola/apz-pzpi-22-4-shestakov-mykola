package com.growmate.android.growmateandroid.activities

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.growmate.android.growmateandroid.R
import com.growmate.android.growmateandroid.viewmodels.LoginViewModel
import com.growmate.android.growmateandroid.AuthManager

class LoginActivity : AppCompatActivity() {
    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var loginButton: Button
    private lateinit var viewModel: LoginViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        viewModel = ViewModelProvider(this)[LoginViewModel::class.java]

        val token = AuthManager.getToken(this)

        if (!token.isNullOrBlank()) {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
            return
        }

        setContentView(R.layout.activity_login)

        emailInput = findViewById(R.id.emailEdit)
        passwordInput = findViewById(R.id.passwordEdit)
        loginButton = findViewById(R.id.loginBtn)

        loginButton.setOnClickListener {
            val email = emailInput.text.toString()
            val password = passwordInput.text.toString()
            viewModel.login(email, password)
        }

        viewModel.loginResult.observe(this) { result ->
            result.onSuccess { token ->
                AuthManager.setToken(this, token)

                // Start MainActivity
                val intent = Intent(this, MainActivity::class.java)
                startActivity(intent)
                finish()
            }
            result.onFailure {
                Toast.makeText(this, "Login failed", Toast.LENGTH_SHORT).show()
            }
        }
    }
}