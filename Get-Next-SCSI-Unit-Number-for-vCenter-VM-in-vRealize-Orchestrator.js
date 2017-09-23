//Action Inputs:
//  vm - VC:VirtualMachine
//  scsiController - number     (Defaults to 0)
//
//Return Type: number

var devices = vm.config.hardware.device;
var controllerKey;
var controllerUnit; // typically '7'
if (scsiController == null) {
	scsiController = 0;
}
//Find SCSI Controller key
for (var i=0; i< devices.length; i++) {
	var hba = devices[i];
	if( (hba instanceof VcParaVirtualSCSIController
    		|| hba instanceof VcVirtualBusLogicController
    		|| hba instanceof VcVirtualLsiLogicController
    		|| hba instanceof VcVirtualLsiLogicSASController)
			&& hba.busNumber == scsiController){

		System.log("Found SCSI Controller: "+hba.deviceInfo.label);
		controllerKey = hba.key;
		controllerUnit = hba.scsiCtlrUnitNumber;
	}
}
System.log("controllerKey: "+controllerKey+", controllerUnit: "+controllerUnit);

var u;
for (u=0; u<16; u++) { 
	System.log("Checking unit: "+u);
	var free = true;
	for (var i=0; i<devices.length; i++) {
		if (devices[i].controllerKey !== null && devices[i].controllerKey == controllerKey) {
			if (u == devices[i].unitNumber || u == controllerUnit) {
				//u is used.  break inner loop.
				free = false;
				System.log("  unit in use");
				break;
			}
		}
	}
	if (free) {
		System.log("  unit is free");
		return u;
	}
}

throw ("SCSI Controller is full");