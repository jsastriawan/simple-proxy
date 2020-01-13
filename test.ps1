# Begin flow template
[CmdletBinding()]
Param (
    [Parameter(Mandatory = $true, position = 0,HelpMessage = "Hostname, FQDN, or IP Address")] [string] $hostname,
    [Parameter(Mandatory = $true, position = 1,HelpMessage = "Digest User")] [string] $user,
    [Parameter(Mandatory = $true, position = 2,HelpMessage = "Digest Password")] [string] $password)
 
Import-Module 'IntelvPro'

#Write-Host "hostname: " $hostname
#Write-Host "user:" $user
#Write-Host "password:" $password

########################################
#   Create a Wsman Connection Object   #
########################################
$wsmanConnectionObject = new-object 'Intel.Management.Wsman.WsmanConnection'
$wsmanConnectionObject.Username = $user
$wsmanConnectionObject.Password = $password
# Non-TLS
$wsmanConnectionObject.Address = "http://" + $hostname + ":16992/wsman"
$option = $wsmanConnectionObject.Options;
$option.ProxyAddress = "http://localhost:8080/"

#TLS
# $wsmanConnectionObject.Address = "https://" + $hostname + ":16993/wsman"

 
########################################
#  >>> Insert your code snippet here   #
########################################

$ethernetSettingsRef =$wsmanConnectionObject.NewReference("SELECT * FROM AMT_EthernetPortSettings WHERE InstanceID='Intel(r) AMT Ethernet Port Settings 0'")
$etherSettingsInstance =$ethernetSettingsRef.Get()
$ipaddress = $etherSettingsInstance.GetProperty("IPAddress");

Write-Host "IP Address:" $ipaddress

Remove-Module 'IntelvPro'
# End flow template