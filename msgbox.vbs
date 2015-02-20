Set objArgs = WScript.Arguments
messageTitle = objArgs(0)
messageText = objArgs(1)
retValue = MsgBox (messageText, 1, messageTitle)

if retValue = 1 Then
WScript.Quit 11
ElseIf retValue = 2 Then
WScript.Quit 22
Else
End If