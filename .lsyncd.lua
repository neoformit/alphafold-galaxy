-- Add sync config here

HOST     = "alphafold.neoformit.com"
USER     = "ubuntu"             -- Remote user
SRC_DIR  = "/home/cameron/dev/galaxy/tool-dev/alphafold/ui"   -- Trailing slash syncs dir contents only
DEST_DIR = "/home/ubuntu/alphafold-galaxy"
RSA_KEY  = "/home/cameron/.ssh/qfab"
EXCLUDE  = { '.git' , '.lsyncd.lua', 'sync' }


-- Shouldn't need to touch this:

settings {
    logfile = "/var/log/lsyncd/lsyncd.log",
    statusFile = "/var/log/lsyncd/lsyncd-status.log",
    statusInterval = 20
}

sync {
  default.rsyncssh,
  delay = 3,                    -- Sync delay after file change
  host = HOST,
  source = SRC_DIR,
  targetdir = DEST_DIR,
  exclude = EXCLUDE,
  rsync = {
    rsh = "/usr/bin/ssh -l " .. USER .. " -i " .. RSA_KEY
  }
}
