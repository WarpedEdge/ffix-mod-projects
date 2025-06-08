using System;
using System.Collections.Generic;
using Memoria;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Stat Break: change stat(s) of the target in a flexible way, using the element to determine which stat(s) are modified
    /// </summary>
    [BattleScript(Id)]
    public sealed class StatBreakScript : IBattleScript
    {
        public const Int32 Id = 10009;

        private readonly BattleCalculator _v;

        public StatBreakScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            if (_v.Command.HitRate <= GameRandom.RandomInt(0, 100))
			{
				_v.Context.Flags |= BattleCalcFlags.Miss;
				return;
			}
			Int32 factor = _v.Command.Power;
			List<Object> parameters = new List<Object>();
			if ((_v.Command.Element & EffectElement.Fire) != 0)
			{
				parameters.Add("Strength");
				parameters.Add(_v.Target.Strength * factor / 100);
			}
			if ((_v.Command.Element & EffectElement.Cold) != 0)
			{
				parameters.Add("Magic");
				parameters.Add(_v.Target.Magic * factor / 100);
			}
			if ((_v.Command.Element & EffectElement.Thunder) != 0)
			{
				parameters.Add("Dexterity");
				parameters.Add(_v.Target.Dexterity * factor / 100);
			}
			if ((_v.Command.Element & EffectElement.Earth) != 0)
			{
				parameters.Add("Will");
				parameters.Add(_v.Target.Will * factor / 100);
			}
			if ((_v.Command.Element & EffectElement.Aqua) != 0)
			{
				parameters.Add("PhysicalDefence");
				parameters.Add(_v.Target.PhysicalDefence * factor / 100);
			}
			if ((_v.Command.Element & EffectElement.Wind) != 0)
			{
				parameters.Add("MagicDefence");
				parameters.Add(_v.Target.MagicDefence * factor / 100);
			}
			if ((_v.Command.Element & EffectElement.Holy) != 0)
			{
				parameters.Add("PhysicalEvade");
				parameters.Add(_v.Target.PhysicalEvade * factor / 100);
			}
			if ((_v.Command.Element & EffectElement.Darkness) != 0)
			{
				parameters.Add("MagicEvade");
				parameters.Add(_v.Target.MagicEvade * factor / 100);
			}
			if (parameters.Count > 0)
				_v.Target.TryAlterSingleStatus(BattleStatusId.ChangeStat, true, _v.Caster, parameters.ToArray());
        }
    }
}
