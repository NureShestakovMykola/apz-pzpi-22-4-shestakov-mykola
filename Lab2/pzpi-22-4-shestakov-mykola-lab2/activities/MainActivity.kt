package com.growmate.android.growmateandroid.activities

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.growmate.android.growmateandroid.AuthManager
import com.growmate.android.growmateandroid.R
import com.growmate.android.growmateandroid.viewmodels.MainViewModel

class MainActivity : AppCompatActivity() {
    private lateinit var userNameText: TextView
    private lateinit var logoutButton: Button
    private lateinit var viewModel: MainViewModel
    private lateinit var drawerButton: ImageButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        userNameText = findViewById(R.id.text_user_name)
        logoutButton = findViewById(R.id.button_logout)
        drawerButton = findViewById(R.id.button_drawer)

        drawerButton.setOnClickListener {
            val drawer = findViewById<DrawerLayout>(R.id.drawerLayout)
            drawer.openDrawer(GravityCompat.START)
        }

        logoutButton.setOnClickListener {
            viewModel.logout()
        }

        viewModel = ViewModelProvider(this)[MainViewModel::class.java]
        val token = AuthManager.getToken(this)
        if (token.isNullOrBlank()) {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish()
            return
        }
        viewModel.token = token

        viewModel.fetchUser()

        viewModel.user.observe(this) { result ->
            result.onSuccess {
                userNameText.text = "${it.name} ${it.surname}"
            }
            result.onFailure {
                Toast.makeText(this, "Failed to load user", Toast.LENGTH_SHORT).show()
            }
        }

        viewModel.logoutResult.observe(this) { result ->
            result.onSuccess {
                AuthManager.clear(this)
                val intent = Intent(this, LoginActivity::class.java)
                startActivity(intent)
                finish()
            }
            result.onFailure {
                Toast.makeText(this, "Failed to logout", Toast.LENGTH_SHORT).show()
            }
        }

        openDeviceList()
    }

    private fun openDeviceList() {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, DeviceListFragment())
            .commit()
    }

    fun openDeviceDetail(deviceId: Int) {
        val fragment = DeviceDetailFragment()
        fragment.arguments = Bundle().apply {
            putInt("deviceId", deviceId)
        }
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .addToBackStack(null)
            .commit()
    }
}