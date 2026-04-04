import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { LambdaService } from "@/utils/lambdaService"


const PopupAutomationRunner = ({ coolDown, repo, handleDisableBtn }) => {
  const [dialogOpen, setDialogOpen] = useState(!coolDown[repo])
  const [userEmail, setUserEmail] = useState("")
  const [emailError, setEmailError] = useState(false)

  const handleRunSubmint = () => {
    if (userEmail !== '') {
      if (emailIsValid()) {
        runAutomation()
      } else {
        setEmailError(true)
      }
    }
  }

  const handleClose = () => {
    setDialogOpen(false)
    setUserEmail("")
    setEmailError(false)
    handleDisableBtn(repo, true)
  }

  const runAutomation = () => {
    if (coolDown[repo]) {
      setDialogOpen(false)
    } else {
      // run lambda
      LambdaService.regressionTest(repo, userEmail)
        .then(() => setDialogOpen(false))
        .catch((err) => console.error(err))
      handleDisableBtn(repo, false)
    }
  }

  const emailIsValid = () => {
    // Robust email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (emailRegex.test(userEmail)) {
      return true // No error, allow submitting
    } else {
      return false // Error present, disable submitting
    }
  }

  const handleOnBlue = () => {
    if (userEmail !== '') {
      setEmailError(!emailIsValid())
    }
    else {
      setEmailError(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get notified when the test is done</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Optional: Enter your Email..."
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            onBlur={handleOnBlue}
          />
          {emailError && <p className="text-red-500 text-sm">Please enter a valid email</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleRunSubmint}>
            Run Test</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default PopupAutomationRunner
