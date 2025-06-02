package com.growmate.android.growmateandroid.activities

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.ViewModelProvider
import com.growmate.android.growmateandroid.AuthManager
import com.growmate.android.growmateandroid.R
import com.growmate.android.growmateandroid.viewmodels.DeviceDetailViewModel

class DeviceDetailFragment : Fragment() {
    private lateinit var viewModel: DeviceDetailViewModel

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        val view = inflater.inflate(R.layout.fragment_device_detail, container, false)
        val nameText: TextView = view.findViewById(R.id.text_device_name)
        val descriptionText: TextView = view.findViewById(R.id.text_device_description)
        val automaticWateringText: TextView = view.findViewById(R.id.text_device_automatic_watering_value)
        val waterLevelText: TextView = view.findViewById(R.id.text_device_water_level_value)
        val lastWateringText: TextView = view.findViewById(R.id.text_device_last_watering_value)
        val moistureText: TextView = view.findViewById(R.id.text_device_moisture_value)
        val tempText: TextView = view.findViewById(R.id.text_device_temp_value)
        val criticalMinMoistureText: TextView = view.findViewById(R.id.text_device_critical_min_moisture)
        val criticalMaxMoistureText: TextView = view.findViewById(R.id.text_device_critical_max_moisture)
        val criticalMinTempText: TextView = view.findViewById(R.id.text_device_critical_min_temp)
        val criticalMaxTempText: TextView = view.findViewById(R.id.text_device_critical_max_temp)
        val wateringButton: Button = view.findViewById(R.id.button_watering)
        val imageDevice: ImageView = view.findViewById(R.id.image_device)

        val id = arguments?.getInt("deviceId") ?: return view
        val token = AuthManager.getToken(requireContext()) ?: return view

        viewModel = ViewModelProvider(this)[DeviceDetailViewModel::class.java]
        viewModel.deviceId = id
        viewModel.token = token

        viewModel.fetchDevice()

        viewModel.device.observe(viewLifecycleOwner) { result ->
            result.onSuccess {
                nameText.text = it.name
                descriptionText.text = it.description
                automaticWateringText.text = if (it.automaticWatering) "ON" else "OFF"
                waterLevelText.text = "${it.waterLevel}%"
                lastWateringText.text = it.lastWatering
                moistureText.text = "${it.currentMoisture}%"
                tempText.text = "${it.currentTemperature}°C"
                criticalMinMoistureText.text = "${it.criticalMinMoisture}%"
                criticalMaxMoistureText.text = "${it.criticalMaxMoisture}%"
                criticalMinTempText.text = "${it.criticalMinTemperature}°C"
                criticalMaxTempText.text = "${it.criticalMaxTemperature}°C"
                wateringButton.setOnClickListener {
                    val dialogView = LayoutInflater.from(requireContext()).inflate(R.layout.dialog_watering_duration, null)
                    val inputField = dialogView.findViewById<EditText>(R.id.input_watering_duration)

                    AlertDialog.Builder(requireContext())
                        .setTitle("Enter Data")
                        .setView(dialogView)
                        .setPositiveButton("Confirm") { dialog, _ ->
                            val duration = inputField.text.toString().toIntOrNull()
                            if (duration != null) {
                                viewModel.scheduleWatering(duration)
                            } else {
                                Toast.makeText(context, "Invalid input", Toast.LENGTH_SHORT).show()
                            }
                            dialog.dismiss()
                        }
                        .setNegativeButton("Cancel") { dialog, _ ->
                            dialog.dismiss()
                        }
                        .show()
                }

                if (it.imageExtension != null) {
                    viewModel.fetchDeviceImage()
                }
            }
            result.onFailure {
                Toast.makeText(context, "Failed to load device", Toast.LENGTH_SHORT).show()
            }
        }

        viewModel.deviceImage.observe(viewLifecycleOwner) { result ->
            result.onSuccess {
                imageDevice.setImageBitmap(it)
            }
            result.onFailure {
                Toast.makeText(context, "Failed to load device image", Toast.LENGTH_SHORT).show()
            }
        }

        viewModel.wateringRequestResult.observe(viewLifecycleOwner) { result ->
            result.onSuccess {
                Toast.makeText(context, "Watering request sent", Toast.LENGTH_SHORT).show()
            }
            result.onFailure {
                Toast.makeText(context, "Failed to send watering request", Toast.LENGTH_SHORT)
                    .show()
            }
        }

        return view
    }
}