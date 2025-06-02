package com.growmate.android.growmateandroid.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.growmate.android.growmateandroid.api.RetrofitClient
import com.growmate.android.growmateandroid.models.ApiResponse
import com.growmate.android.growmateandroid.models.DeviceModel
import com.growmate.android.growmateandroid.models.LoginModel
import com.growmate.android.growmateandroid.models.UserModel
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainViewModel : ViewModel() {
    private val _user = MutableLiveData<Result<UserModel>>()
    val user: LiveData<Result<UserModel>> get() = _user

    private val _logoutResult = MutableLiveData<Result<String>>()
    val logoutResult: LiveData<Result<String>> get() = _logoutResult

    var token: String = ""

    fun fetchUser() {
        val call = RetrofitClient.instance.getUser("Bearer $token")

        call.enqueue(object : Callback<ApiResponse<UserModel>> {
            override fun onResponse(call: Call<ApiResponse<UserModel>>,
                                    response: Response<ApiResponse<UserModel>>) {
                if (response.isSuccessful && response.body() != null) {
                    _user.postValue(Result.success(response.body()!!.data!!))
                } else {
                    val error = response.errorBody()?.string() ?: "Failed to load device"
                    _user.postValue(Result.failure(Exception(error)))
                }
            }

            override fun onFailure(call: Call<ApiResponse<UserModel>>, t: Throwable) {
                _user.postValue(Result.failure(t))
            }
        })
    }

    fun logout() {
        val call = RetrofitClient.instance.logout("Bearer $token")

        call.enqueue(object : Callback<ApiResponse<String>> {
            override fun onResponse(call: Call<ApiResponse<String>>,
                                    response: Response<ApiResponse<String>>) {
                if (response.isSuccessful && response.body() != null) {
                    _logoutResult.postValue(Result.success(response.body()!!.data!!))
                } else {
                    val error = response.errorBody()?.string() ?: "Failed to logout"
                    _logoutResult.postValue(Result.failure(Exception(error)))
                }
            }

            override fun onFailure(call: Call<ApiResponse<String>>, t: Throwable) {
                _logoutResult.postValue(Result.failure(t))
            }
        })
    }
}