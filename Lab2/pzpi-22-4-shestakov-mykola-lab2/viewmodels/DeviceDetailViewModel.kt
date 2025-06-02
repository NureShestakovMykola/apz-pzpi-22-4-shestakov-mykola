package com.growmate.android.growmateandroid.viewmodels

import android.graphics.Bitmap
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.growmate.android.growmateandroid.api.RetrofitClient
import com.growmate.android.growmateandroid.models.DeviceModel
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.graphics.BitmapFactory
import com.growmate.android.growmateandroid.models.ApiResponse
import com.growmate.android.growmateandroid.models.ManualWateringRequestModel

class DeviceDetailViewModel : ViewModel() {
    private val _device = MutableLiveData<Result<DeviceModel>>()
    val device: LiveData<Result<DeviceModel>> get() = _device

    private val _deviceImage = MutableLiveData<Result<Bitmap?>>()
    val deviceImage: LiveData<Result<Bitmap?>> get() = _deviceImage

    private val _wateringRequestResult = MutableLiveData<Result<String?>>()
    val wateringRequestResult: LiveData<Result<String?>> get() = _wateringRequestResult

    var deviceId: Int = -1
    var token: String = ""

    fun fetchDevice() {
        val call = RetrofitClient.instance.getDevice("Bearer $token", deviceId)

        call.enqueue(object : Callback<ApiResponse<DeviceModel>> {
            override fun onResponse(call: Call<ApiResponse<DeviceModel>>,
                                    response: Response<ApiResponse<DeviceModel>>) {
                if (response.isSuccessful && response.body() != null) {
                    _device.postValue(Result.success(response.body()!!.data!!))
                } else {
                    val error = response.errorBody()?.string() ?: "Failed to load device"
                    _device.postValue(Result.failure(Exception(error)))
                }
            }

            override fun onFailure(call: Call<ApiResponse<DeviceModel>>, t: Throwable) {
                _device.postValue(Result.failure(t))
            }
        })
    }

    fun fetchDeviceImage() {
        val call = RetrofitClient.instance.getDeviceImage("Bearer $token", deviceId)

        call.enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful && response.body() != null) {
                    val inputStream = response.body()!!.byteStream()
                    val bitmap = BitmapFactory.decodeStream(inputStream)
                    _deviceImage.postValue(Result.success(bitmap))
                } else {
                    val error = response.errorBody()?.string() ?: "Failed to load device image"
                    _deviceImage.postValue(Result.failure(Exception(error)))
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                _deviceImage.postValue(Result.failure(t))
            }
        })
    }

    fun scheduleWatering(duration: Int){
        val call = RetrofitClient.instance
            .manualWateringRequest(ManualWateringRequestModel(deviceId, duration))

        call.enqueue(object : Callback<ApiResponse<String>> {
            override fun onResponse(call: Call<ApiResponse<String>>, response: Response<ApiResponse<String>>) {
                if (response.isSuccessful) {
                    _wateringRequestResult.postValue(Result.success(response.body()!!.data))
                } else {
                    val error = response.errorBody()?.string() ?: "Watering request failed"
                    _wateringRequestResult.postValue(Result.failure(Exception(error)))
                }
            }

            override fun onFailure(call: Call<ApiResponse<String>>, t: Throwable) {
                _wateringRequestResult.postValue(Result.failure(t))
            }
        })
    }
}