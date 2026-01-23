using System;
using Memoria;
using Memoria.Data;
using Object = System.Object;

namespace Memoria.Scripts.Status
{
    [StatusScript(BattleStatusId.CustomStatus23)]
    public sealed class DefenseDownStatusScript : StatusScriptBase, IFinishCommandScript
    {
        private const Int32 DefaultTurns = 3;
        private Int32 _baseDefence;
        private Boolean _hasBaseDefence;

        public Int32 TotalDiff { get; private set; }
        public Int32 TotalPercent { get; private set; }
        public Int32 RemainingTurns { get; private set; }
        public Int32 BaseDefence => _baseDefence;
        public Boolean HasBaseDefence => _hasBaseDefence;

        public override UInt32 Apply(BattleUnit target, BattleUnit inflicter, params Object[] parameters)
        {
            base.Apply(target, inflicter, parameters);

            if (parameters != null && parameters.Length >= 3)
            {
                Int32 diffApplied = Convert.ToInt32(parameters[0]);
                Int32 totalPercent = Convert.ToInt32(parameters[1]);
                Int32 baseDefence = Convert.ToInt32(parameters[2]);

                if (!_hasBaseDefence || baseDefence > _baseDefence)
                {
                    _baseDefence = baseDefence;
                    _hasBaseDefence = true;
                }

                if (diffApplied > 0)
                    TotalDiff += diffApplied;

                if (_hasBaseDefence)
                    TotalDiff = Math.Min(TotalDiff, _baseDefence);

                TotalPercent = totalPercent;
            }

            RefreshTurns(DefaultTurns);

            return btl_stat.ALTER_SUCCESS;
        }

        public void RefreshTurns(Int32 turns)
        {
            RemainingTurns = Math.Max(0, turns);
        }

        public void NotifyDurationUpdated()
        {
        }

        public override Boolean Remove()
        {
            if (TotalDiff > 0)
            {
                Int32 restored = Target.PhysicalDefence + TotalDiff;
                if (_hasBaseDefence)
                    restored = Math.Min(restored, _baseDefence);
                restored = Math.Max(0, restored);
                btl_stat.AlterStatus(Target, BattleStatusId.ChangeStat, Inflicter, false, 0, 6, "PhysicalDefence", restored);
            }

            TotalDiff = 0;
            TotalPercent = 0;
            _baseDefence = 0;
            _hasBaseDefence = false;
            RemainingTurns = 0;

            return true;
        }

        public void OnFinishCommand(CMD_DATA cmd, Int32 tranceDecrease)
        {
            if (cmd == null || Target == null || cmd.regist != Target.Data)
                return;

            // Ignore reactions or internal commands.
            if (cmd.cmd_no < BattleCommandId.Attack || cmd.cmd_no > BattleCommandId.BoundaryCheck)
                return;

            if (RemainingTurns <= 0)
                return;

            RemainingTurns--;

            if (RemainingTurns <= 0 && Target.IsUnderAnyStatus(BattleStatus.CustomStatus23))
                Target.RemoveStatus(BattleStatusId.CustomStatus23);
        }
    }
}
