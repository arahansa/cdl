
# >>> cdl shell integration >>>
cdl() {
  case "$1" in
    add|rm|list|init|resolve|port|help|--help|-h)
      command cdl "$@"
      ;;
    *)
      local dir=$(command cdl resolve "$1" 2>/dev/null)
      if [ -n "$dir" ]; then
        cd "$dir"
      else
        command cdl "$@"
      fi
      ;;
  esac
}

_cdl() {
  local aliases=($(command cdl list --names 2>/dev/null))
  local subcommands=(add rm list init port help)
  _describe 'command' subcommands
  _describe 'alias' aliases
}
compdef _cdl cdl
# <<< cdl shell integration <<<
