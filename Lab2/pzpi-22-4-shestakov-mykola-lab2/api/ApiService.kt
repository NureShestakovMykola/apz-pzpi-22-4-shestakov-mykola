package com.growmate.android.growmateandroid.api

import com.growmate.android.growmateandroid.models.ApiListResponse
import com.growmate.android.growmateandroid.models.ApiResponse
import com.growmate.android.growmateandroid.models.DeviceListItemModel
import com.growmate.android.growmateandroid.models.DeviceModel
import com.growmate.android.growmateandroid.models.LoginModel
import com.growmate.android.growmateandroid.models.ManualWateringRequestModel
import com.growmate.android.growmateandroid.models.UserModel
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {
    @POST("appUser/login")
    fun login(@Body model: LoginModel): Call<ApiResponse<String>> // token

    @POST("appUser/logout")
    fun logout(@Header("Authorization") token: String):
            Call<ApiResponse<String>>

    @GET("appUser/current-user")
    fun getUser(
        @Header("Authorization") token: String
    ): Call<ApiResponse<UserModel>>

    @GET("device/all")
    fun getDevices(@Header("Authorization") token: String):
            Call<ApiListResponse<DeviceListItemModel>>

    @GET("device/{id}")
    fun getDevice(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): Call<ApiResponse<DeviceModel>>

    @GET("device/{id}/image")
    fun getDeviceImage(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): Call<ResponseBody>

    @POST("device/manual-watering-request")
    fun manualWateringRequest(@Body model: ManualWateringRequestModel):
            Call<ApiResponse<String>>
}