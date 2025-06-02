package com.growmate.android.growmateandroid.activities

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ListView
import android.widget.Toast
import android.widget.ArrayAdapter
import androidx.lifecycle.ViewModelProvider
import com.growmate.android.growmateandroid.AuthManager
import com.growmate.android.growmateandroid.R
import com.growmate.android.growmateandroid.viewmodels.DeviceListViewModel

class DeviceListFragment : Fragment() {
    private lateinit var viewModel: DeviceListViewModel
    private lateinit var listView: ListView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val view = inflater.inflate(R.layout.fragment_device_list, container, false)
        listView = view.findViewById(R.id.deviceList)

        viewModel = ViewModelProvider(this)[DeviceListViewModel::class.java]

        val token = AuthManager.getToken(requireContext()) ?: return view
        viewModel.token = token

        viewModel.fetchDevices()

        viewModel.devices.observe(viewLifecycleOwner) { result ->
            result.onSuccess { devices ->
                val adapter = ArrayAdapter(
                    requireContext(),
                    android.R.layout.simple_list_item_1,
                    devices.map { it.name })
                listView.adapter = adapter
                listView.setOnItemClickListener { _, _, position, _ ->
                    val id = devices[position].id
                    (activity as? MainActivity)?.openDeviceDetail(id)
                }
            }
            result.onFailure {
                Toast.makeText(context, "Failed to load devices", Toast.LENGTH_SHORT).show()
            }
        }

        return view
    }
}
