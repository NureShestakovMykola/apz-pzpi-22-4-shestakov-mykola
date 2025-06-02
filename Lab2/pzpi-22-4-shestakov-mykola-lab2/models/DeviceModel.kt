package com.growmate.android.growmateandroid.models

data class DeviceModel(
    val id: Int,
    val name: String,
    val description: String,
    val automaticWatering: Boolean,
    val criticalMinMoisture: Int,
    val criticalMaxMoisture: Int,
    val criticalMinTemperature: Int,
    val criticalMaxTemperature: Int,
    val currentMoisture: Int?,
    val currentTemperature: Int?,
    val scheduleId: Int?,
    val waterLevel: Int,
    val lastWatering: String?,
    val imageExtension: String?
)
