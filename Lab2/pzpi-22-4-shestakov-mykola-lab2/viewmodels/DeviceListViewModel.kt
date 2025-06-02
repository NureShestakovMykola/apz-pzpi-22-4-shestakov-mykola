package com.growmate.android.growmateandroid.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.growmate.android.growmateandroid.api.RetrofitClient
import com.growmate.android.growmateandroid.models.ApiListResponse
import com.growmate.android.growmateandroid.models.DeviceListItemModel
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class DeviceListViewModel : ViewModel() {
    private val _devices = MutableLiveData<Result<List<DeviceListItemModel>>>()
    val devices: LiveData<Result<List<DeviceListItemModel>>> get() = _devices

    var token: String = ""

    fun fetchDevices() {
        val call = RetrofitClient.instance.getDevices("Bearer $token")

        call.enqueue(object : Callback<ApiListResponse<DeviceListItemModel>> {
            override fun onResponse(
                call: Call<ApiListResponse<DeviceListItemModel>>,
                response: Response<ApiListResponse<DeviceListItemModel>>
            ) {
                if (response.isSuccessful && response.body() != null) {
                    _devices.postValue(Result.success(response.body()!!.data))
                } else {
                    val error = response.errorBody()?.string() ?: "Failed to fetch device list"
                    _devices.postValue(Result.failure(Exception(error)))
                }
            }

            override fun onFailure(call: Call<ApiListResponse<DeviceListItemModel>>, t: Throwable) {
                _devices.postValue(Result.failure(t))
            }
        })
    }
}