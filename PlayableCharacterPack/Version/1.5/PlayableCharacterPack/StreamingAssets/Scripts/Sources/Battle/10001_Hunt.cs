using System;
using System.Collections.Generic;
using Memoria.Data;
using FF9;

namespace Memoria.Scripts.Battle
{
    [BattleScript(Id)]
    public sealed class Hunt : IBattleScript
    {
        public const Int32 Id = 10001;

        private readonly BattleCalculator _v;
		
		private static Dictionary<BTL_DATA, KeyValuePair<BTL_DATA, Int32>> _huntingDic = new Dictionary<BTL_DATA, KeyValuePair<BTL_DATA, Int32>>();

		public static Int32 GetAttackCount(BTL_DATA hunter, BTL_DATA target, Boolean increment = false)
		{
			KeyValuePair<BTL_DATA, Int32> kvp;
			if (!_huntingDic.TryGetValue(hunter, out kvp) || kvp.Key != target)
				return -1;
			Int32 count = kvp.Value;
			if (increment)
				_huntingDic[hunter] = new KeyValuePair<BTL_DATA, Int32>(target, count + 1);
			return count;
		}

        public Hunt(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
			_huntingDic[_v.Caster] = new KeyValuePair<BTL_DATA, Int32>(_v.Target, 0);
        }
    }
}