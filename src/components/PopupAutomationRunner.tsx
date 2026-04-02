import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { DAL } from "@/utils/DAL"
import { LambdaService } from "@/utils/lambdaService"
import { error } from "console"

// type popupAutomationProps = {
//   coolDown,
//   repo
// }


const PopupAutomationRunner = ({ coolDown, repo, handleDisableBtn }) => {
  const [dialogOpen, setDialogOpen] = useState(!coolDown[repo])
  const [dialogInput, setDialogInput] = useState('')

  const handleRunSubmint = () => {
    const COOL_DOWN = 60000 * 20 // 20 minutes
    if (coolDown[repo]) {
      setDialogOpen(false)
    }
    else {
      // run lambda
      LambdaService.regressionTest(repo).then(() => setDialogOpen(false)).catch(err => console.error(err))
      // handleDisableBtn(repo)
    }

  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Run Automation Test</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Enter your Email to get notified..."
            value={dialogInput}
            onChange={(e) => setDialogInput(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleRunSubmint}>
            Run Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}
export default PopupAutomationRunner