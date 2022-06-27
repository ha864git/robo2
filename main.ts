function set_leg () {
    if (foot_state == "Rup_Ready" || foot_state == "Lup_Ready") {
        if (request_right_leg_angle == right_leg_angle) {
            state_right_leg_angle = "Ready"
        } else if (request_right_leg_angle >= right_leg_angle) {
            right_leg_angle += rotate_legs_pitch
            kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo3, right_leg_angle + (right_leg_init - 90))
            state_right_leg_angle = "Busy"
        } else {
            right_leg_angle += 0 - rotate_legs_pitch
            kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo3, right_leg_angle + (right_leg_init - 90))
            state_right_leg_angle = "Busy"
        }
        if (request_left_leg_angle == left_leg_angle) {
            state_left_leg_angle = "Ready"
        } else if (request_left_leg_angle >= left_leg_angle) {
            left_leg_angle += rotate_legs_pitch
            kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo1, left_leg_angle + (left_leg_init - 90))
            state_left_leg_angle = "Busy"
        } else {
            left_leg_angle += 0 - rotate_legs_pitch
            kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo1, left_leg_angle + (left_leg_init - 90))
            state_left_leg_angle = "Busy"
        }
        if (state_right_leg_angle == "Ready" && state_left_leg_angle == "Ready") {
            foot_state = "Busy"
            foot_request = "Down"
        }
    }
}
function ana () {
    if (foot_state == "Down_Ready") {
        if (cmd == "forward") {
            foot_state = "Busy"
            state_right_leg_angle = "Busy"
            state_left_leg_angle = "Busy"
            if (right_leg_angle == left_leg_angle) {
                if (right_leg_angle >= 90) {
                    foot_request = "Lup"
                    request_right_leg_angle = 90 - rotate_legs_pitch * rotate_legs_steps
                    request_left_leg_angle = 90 - rotate_legs_pitch * rotate_legs_steps
                } else {
                    foot_request = "Rup"
                    request_right_leg_angle = 90 + rotate_legs_pitch * rotate_legs_steps
                    request_left_leg_angle = 90 + rotate_legs_pitch * rotate_legs_steps
                }
            } else {
                if (right_leg_angle != 90) {
                    foot_request = "Rup"
                    request_right_leg_angle = 90
                } else if (left_leg_angle != 90) {
                    foot_request = "Lup"
                    request_left_leg_angle = 90
                }
            }
        } else if (cmd == "backward") {
            foot_state = "Busy"
            state_right_leg_angle = "Busy"
            state_left_leg_angle = "Busy"
            if (right_leg_angle == left_leg_angle) {
                if (right_leg_angle >= 90) {
                    foot_request = "Rup"
                    request_right_leg_angle = 90 - rotate_legs_pitch * rotate_legs_steps
                    request_left_leg_angle = 90 - rotate_legs_pitch * rotate_legs_steps
                } else {
                    foot_request = "Lup"
                    request_right_leg_angle = 90 + rotate_legs_pitch * rotate_legs_steps
                    request_left_leg_angle = 90 + rotate_legs_pitch * rotate_legs_steps
                }
            }
        } else if (cmd == "left") {
            foot_state = "Busy"
            state_right_leg_angle = "Busy"
            state_left_leg_angle = "Busy"
            if (right_leg_angle >= 90) {
                foot_request = "Rup"
                request_right_leg_angle = 80
                request_left_leg_angle = 100
            } else {
                foot_request = "Lup"
                request_right_leg_angle = 100
                request_left_leg_angle = 80
            }
        } else if (cmd == "right") {
            foot_state = "Busy"
            state_right_leg_angle = "Busy"
            state_left_leg_angle = "Busy"
            if (right_leg_angle >= 90) {
                foot_request = "Lup"
                request_right_leg_angle = 80
                request_left_leg_angle = 100
            } else {
                foot_request = "Rup"
                request_right_leg_angle = 100
                request_left_leg_angle = 80
            }
        } else if (cmd == "stop") {
            if (right_leg_angle == left_leg_angle) {
                if (right_leg_angle > 90) {
                    foot_request = "Lup"
                    request_right_leg_angle = 90
                    request_left_leg_angle = 90
                } else if (right_leg_angle < 90) {
                    foot_request = "Rup"
                    request_right_leg_angle = 90
                    request_left_leg_angle = 90
                }
            } else {
                if (right_leg_angle != 90) {
                    foot_request = "Rup"
                    request_right_leg_angle = 90
                } else if (left_leg_angle != 90) {
                    foot_request = "Lup"
                    request_left_leg_angle = 90
                }
            }
        }
    }
}
control.onEvent(EventBusSource.MES_DPAD_CONTROLLER_ID, EventBusValue.MICROBIT_EVT_ANY, function () {
    if (lastValue != control.eventValue()) {
        if (control.eventValue() == 1) {
            cmd = "forward"
            basic.showArrow(ArrowNames.South)
        } else if (control.eventValue() == 3) {
            cmd = "backward"
            basic.showArrow(ArrowNames.North)
        } else if (control.eventValue() == 5) {
            cmd = "left"
            basic.showArrow(ArrowNames.East)
        } else if (control.eventValue() == 7) {
            cmd = "right"
            basic.showArrow(ArrowNames.West)
        } else {
            cmd = "stop"
            basic.showIcon(IconNames.SmallSquare)
        }
        lastValue = control.eventValue()
    }
})
function set_foot () {
    Rup_right_foot_target = 126
    Lup_right_foot_target = 72
    if (foot_request == "Rup") {
        if (right_foot_angle >= Rup_right_foot_target) {
            foot_state = "Rup_Ready"
        } else {
            if (right_foot_angle >= 90) {
                right_foot_angle += 4
                left_foot_angle += 2
            } else {
                right_foot_angle += 2
                left_foot_angle += 4
            }
            kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo2, left_foot_angle + (left_foot_init - 90))
            kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo4, right_foot_angle + (right_foot_init - 90))
            foot_state = "Busy"
        }
    } else if (foot_request == "Lup") {
        if (right_foot_angle <= Lup_right_foot_target) {
            foot_state = "Lup_Ready"
        } else {
            if (right_foot_angle > 90) {
                right_foot_angle += -4
                left_foot_angle += -2
            } else {
                right_foot_angle += -2
                left_foot_angle += -4
            }
            kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo2, left_foot_angle + (left_foot_init - 90))
            kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo4, right_foot_angle + (right_foot_init - 90))
            foot_state = "Busy"
        }
    } else {
        if (right_foot_angle == 90) {
            foot_state = "Down_Ready"
        } else {
            if (right_foot_angle >= 90) {
                right_foot_angle += -4
                left_foot_angle += -2
            } else {
                right_foot_angle += 2
                left_foot_angle += 4
            }
            kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo2, left_foot_angle + (left_foot_init - 90))
            kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo4, right_foot_angle + (right_foot_init - 90))
            foot_state = "Busy"
        }
    }
}
let Lup_right_foot_target = 0
let Rup_right_foot_target = 0
let rotate_legs_steps = 0
let rotate_legs_pitch = 0
let cmd = ""
let state_left_leg_angle = ""
let state_right_leg_angle = ""
let request_left_leg_angle = 0
let request_right_leg_angle = 0
let left_leg_angle = 0
let right_leg_angle = 0
let foot_state = ""
let foot_request = ""
let left_foot_angle = 0
let right_foot_angle = 0
let right_foot_init = 0
let right_leg_init = 0
let left_foot_init = 0
let left_leg_init = 0
let lastValue = 0
lastValue = 0
led.setBrightness(10)
basic.showIcon(IconNames.Heart)
bluetooth.startLEDService()
left_leg_init = 88
left_foot_init = 86
right_leg_init = 95
right_foot_init = 90
kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo1, left_leg_init)
kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo2, left_foot_init)
kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo3, right_leg_init)
kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo4, right_foot_init)
right_foot_angle = 90
left_foot_angle = 90
foot_request = "Down"
foot_state = "Down_Ready"
right_leg_angle = 90
left_leg_angle = 90
request_right_leg_angle = 90
request_left_leg_angle = 90
state_right_leg_angle = "Busy"
state_left_leg_angle = "Busy"
cmd = "stop"
rotate_legs_pitch = 2
rotate_legs_steps = 10
loops.everyInterval(50, function () {
    ana()
    set_foot()
    set_leg()
})
